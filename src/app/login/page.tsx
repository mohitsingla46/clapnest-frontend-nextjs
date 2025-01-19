"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { LOGIN_MUTATION } from '@/graphql/graphql-queries';
import { useMutation } from '@apollo/client';
import { useAppDispatch } from '../redux/store/hooks';
import { login } from '../redux/features/authSlice';
import Cookies from "js-cookie";
import toast from 'react-hot-toast';
import Link from 'next/link';

const schema = z.object({
    email: z.string().nonempty('Email is required').email("Invalid email"),
    password: z.string().nonempty('Password is required')
});

type FormData = z.infer<typeof schema>;

const Login = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [loginMutation] = useMutation(LOGIN_MUTATION);
    const dispatch = useAppDispatch();

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        try {
            const response = await loginMutation({ variables: { email: data.email, password: data.password } });
            dispatch(login({ token: response.data.signin.token, user: response.data.signin.user }));
            Cookies.set("token", response.data.signin.token, { expires: 7 });
            localStorage.setItem('user', JSON.stringify(response.data.signin.user));
            router.push("/dashboard");
        } catch (error: any) {
            toast.error(error.message || "An unknown error occurred");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-400 to-cyan-400">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-2xl mb-6 text-center text-gray-800">ClapNest</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className={`w-full p-3 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                            {...register("email")}
                        />
                        {errors.email && (
                            <div className="text-red-500 text-sm">{errors.email.message}</div>
                        )}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className={`w-full p-3 border rounded-md ${errors.password ? 'border-red-500' : 'border-gray-300'
                                }`}
                            {...register("password")}
                        />
                        {errors.password && (
                            <div className="text-red-500 text-sm">{errors.password.message}</div>
                        )}
                    </div>

                    <button color={"primary"} type="submit" className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-500 disabled:bg-gray-400" disabled={loading}>
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <p className="text-gray-700">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-blue-600 hover:text-blue-500">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login