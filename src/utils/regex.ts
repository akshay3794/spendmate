const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[6-9]\d{9}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;

export { emailRegex, passwordRegex, phoneRegex, nameRegex };
