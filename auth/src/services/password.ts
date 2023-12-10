import bcrypt from 'bcrypt';

export class Password {
    static async toHash(password: string) {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);

        const hashedPassword = await bcrypt.hash(password,salt);
        return hashedPassword;
    }

    static async compare(storePassword: string, suppliedPassword: string) {
        const isMatch = await bcrypt.compare(suppliedPassword, storePassword);

        return isMatch;
    }
}
// Static method is used to access class functions without making a instance of class