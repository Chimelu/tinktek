export interface IEmailDTO {
    to: string,
    subject: string,
    html: string,
    attachment?: any,
    isAttachment?: boolean
}

export interface IBulkEmailDTO {
    bcc: string,
    subject: string,
    html: string,
    attachment?: any,  
    isAttachment?: boolean
}
