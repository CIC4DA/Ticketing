import { useState } from "react";
import axios from 'axios';
import { useForm } from "react-hook-form";
import Router from "next/router";

const signup = () => {
    const [backendErrors, setBackendErrors] = useState([]);
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm();


    const onSubmit = async (data) => {
        await axios.post('/api/users/signin', {
            email: data.email,
            password: data.password
        }).then((response) => {
            console.log(response?.data);
            reset();
            Router.push('/');
        })
        .catch(({ response }) => {
            console.log(response.data);
            setBackendErrors(response.data.errors)
        })
    }


    return (
        <>
            {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        className="mx-auto h-10 w-auto"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                        alt="Your Company"
                    />
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Sign In to your account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form noValidate className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                                            message: 'Email is not Valid'
                                        }
                                    })}
                                    type="email"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                                <p className='text-red-500 text-xs'>{errors?.email?.message}</p>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                    Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    {...register("password", {
                                        required: "Password is required",
                                        pattern: {
                                            value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
                                            message: "- at least 8 characters are required\n- must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number\n - Can contain special characters"
                                        }
                                    })}
                                    type="password"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                                <div className='text-red-500 text-xs'>{errors?.password?.message}</div>
                            </div>
                        </div>

                        {backendErrors && backendErrors.map((error) => {
                            return (<p className='text-red-500 text-xs'>{error.message}</p>)
                        })}

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gradient-to-br from-pink-500 to-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        Don't Have an Account? {' '}
                        <a to="/signin" className="font-semibold leading-6 text-black hover:text-transparent bg-clip-text bg-gradient-to-br from-pink-500 to-orange-400">
                            SignUp
                        </a>
                    </p>
                </div>
            </div>
        </>
    )
}

export default signup;