import RegisterForm from "@/components/vorodi/registerform/registerform";

export default function RegisterPage() {
    return (
        <div className={`min-h-screen flex bg-black bg-gradient-to-br  to-indigo-600 items-center  justify-center py-12 px-4 sm:px-6 lg:px-8 `}>
            <div className="max-w-md w-full space-y-8">
                <RegisterForm />
            </div>
        </div>
    );
}