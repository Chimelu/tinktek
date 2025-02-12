import bcrypt from "bcryptjs";
import { IDataAccessRepo } from "../../core/repositories/dataAccess.repository";
import { createUserDto } from "./dto";
import { IUser } from "../../core/entity/user.entity";
import { NotFoundError, UnauthorizedError } from "../../infrastructure/errorHandler/error";
import config from "../../infrastructure/config/env.config";
import jwt from "jsonwebtoken";
// import { USER_RESPONSE } from "../../infrastructure/constants/responses/userResponse.constant";

class UserService {
  constructor(private userRepo: IDataAccessRepo<IUser>) {
    this.userRepo = userRepo;
  }

  public async registerUser(userData: any) {
    // Validate and transform input data
    const data = createUserDto(userData);

    // Hash password before saving
    const saltRounds = 10;
    data.password = await bcrypt.hash(data.password, saltRounds);

    // Save the user to the database
    const newUser = await this.userRepo.create(data);
    if (!newUser) throw new NotFoundError("user not found");

    return newUser;
  }


  public async loginUser(email: string, password: string) {
    // Find user by email
    const user = await this.userRepo.findOne({ email: email });

    if (!user) throw new NotFoundError("User not found");

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedError("Invalid credentials");

    // Generate JWT token
    const token = jwt.sign({ id: user.id, role: user.role }, config.secret as string, {
      expiresIn: "30d",
    });

    return {
      message: "Login successful",
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    };
  }

  public async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.userRepo.findOne({ id: userId });

    if (!user) throw new NotFoundError("User not found");

    // Compare old password with hashed password in DB
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new Error("Old password is incorrect");

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await this.userRepo.updateOne({ id: userId }, { password: hashedPassword });

    return { message: "Password updated successfully" };
  }

  /**
   * Update user profile
   */
  public async updateProfile(userId: string, updateData: Partial<IUser>) {
    const user = await this.userRepo.findOne({ id: userId });
    if (!user) throw new NotFoundError("User not found");

    // Remove password field if present
    if (updateData.password) delete updateData.password;

    // Update user details
    const updatedUser = await this.userRepo.updateOne({ id: userId }, updateData);

    return updatedUser;
  }
}

export default UserService;
