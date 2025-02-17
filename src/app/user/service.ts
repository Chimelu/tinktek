import bcrypt from "bcryptjs";
import { IDataAccessRepo } from "../../core/repositories/dataAccess.repository";
import { createUserDto, updateUserDto } from "./dto";
import { IUser } from "../../core/entity/user.entity";
import { NotFoundError, UnauthorizedError } from "../../infrastructure/errorHandler/error";
import config from "../../infrastructure/config/env.config";
import jwt from "jsonwebtoken";
import cloudinary from "../../infrastructure/uploads/cloudinaryUpload";
import { sendEmail } from "../../core/services/mailService";
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

    // Generate a 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP

    // Save the user to the database
    const newUser = await this.userRepo.create({ ...data, otp });
    if (!newUser) throw new NotFoundError("User not found");

    // Send OTP via email
    await sendEmail(
      newUser.email,
      "Your OTP Code",
      `Your verification code is: ${otp}. It expires in 10 minutes.`
    );

    return { message: "User registered successfully. OTP sent to email.", user: newUser };
  }


  public async resendOtp(email: string) {
    // Find the user by email
    const user = await this.userRepo.findOne({ email });
    if (!user) throw new NotFoundError("User not found");

    // Generate a new 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Update user record with new OTP
    await this.userRepo.updateOne({id:user.id},  {otp} );

    // Send the new OTP via email
    await sendEmail(
      user.email,
      "Your New OTP Code",
      `Your new verification code is: ${otp}. It expires in 10 minutes.`
    );

    return { message: "OTP resent successfully. Check your email." };
  }


  public async verifyOtp(email: string, otp: string) {
    // Find the user by email
    const user = await this.userRepo.findOne({ email });
    if (!user) throw new NotFoundError("User not found");

    // Check if OTP matches
    if (user.otp !== otp) {
        throw new UnauthorizedError("Invalid OTP. Please try again.");
    }

    // Update user's isVerified status to true
    await this.userRepo.updateOne(
        { id: user.id }, 
        {isVerified: true } 
    );

    return { message: "OTP verified successfully. Your account is now verified." };
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
      expiresIn: "5d",
    });

    return {
      message: "Login successful",
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        image:user.image,
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
    if (!isMatch) throw new UnauthorizedError("Old password is incorrect");

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

    // Use DTO to filter allowed fields
    const sanitizedUpdateData = updateUserDto(updateData);

    // Update user details
    const updatedUser = await this.userRepo.updateOne({ id: userId }, sanitizedUpdateData);

    return updatedUser;
}





  public async updateProfileImage(userId: string, image: Express.Multer.File): Promise<IUser> {
    // Find the user
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundError("User not found");

    // Convert image buffer to base64 (Cloudinary requires base64 or a file path)
    const base64Image = `data:${image.mimetype};base64,${image.buffer.toString("base64")}`;

    // Upload image to Cloudinary
    let uploadedImageUrl: string;
    try {
        const uploadResult = await cloudinary.uploader.upload(base64Image, {
            folder: "profile-images", // Store images in a dedicated folder
            resource_type: "image",
        });

        uploadedImageUrl = uploadResult.secure_url;
    } catch (error) {
        console.error("Error uploading profile image:", error);
        throw new Error("Image upload failed");
    }

    // Update user's profile image in the database
    const updatedUser = await this.userRepo.updateOne(
        { id: userId },
        { image: uploadedImageUrl },
        { returnOriginal: false }
    );

    if (!updatedUser) throw new NotFoundError("Failed to update profile image");

    return updatedUser;
}
}

export default UserService;
