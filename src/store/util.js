export const updateObject = (oldObj, updatedProps) => {
    return {
        ...oldObj,
        ...updatedProps
    }
}

export const parseError = (errorMessage) => {
    switch (errorMessage) {
        case 'EMAIL_EXISTS': return 'This email is already in use'
        case 'OPERATION_NOT_ALLOWED': return 'User sign-ins are currently disabled'
        case 'TOO_MANY_ATTEMPTS_TRY_LATER': return 'Too many attempts. Please try again later'
        case 'INVALID_EMAIL': return 'Please enter a valid email'
        case 'EMAIL_NOT_FOUND': return 'This email does not exist'
        case 'INVALID_PASSWORD': return 'Password is incorrect'
        case 'WEAK_PASSWORD : Password should be at least 6 characters': return 'Password must be at least 6 characters'
        default: return 'Error: something went wrong'
    }
}

