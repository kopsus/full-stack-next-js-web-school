export type responServerAction = {
    success?: {
        status: boolean;
        message?: string;
    };
    error?: {
        status: boolean;
        message?: string;
    };
    data?: any;
}

type responServerActionProps = {
    statusSuccess: boolean;
    statusError: boolean;
    messageSuccess?: string;
    messageError?: string;
    data?: any;
}

export function responServerAction({ statusSuccess, statusError, messageSuccess, messageError, data }: responServerActionProps) {
    return {
        success: {

            status: statusSuccess,
            message: messageSuccess
        },
        error: {
            status: statusError,
            message: messageError
        },
        data: data
    }
}
