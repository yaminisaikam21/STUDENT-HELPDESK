import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

import { authService } from '../services/authService';
import BrandLogo from '../components/BrandLogo';

export default function VerifyEmail() {
    const { uid, token } = useParams();

    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verify = async () => {
            try {
                const response = await authService.verifyEmail(uid, token);

                setSuccess(true);
                setMessage(
                    response.message || 'Your email has been verified successfully.'
                );
            } catch (error) {
                setSuccess(false);

                setMessage(
                    error.response?.data?.message ||
                    'This verification link is invalid or has expired.'
                );
            } finally {
                setLoading(false);
            }
        };

        verify();
    }, [uid, token]);

    return (
        <div className="min-h-[90vh] flex items-center justify-center px-4 bg-brand-cream">

            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full p-8 rounded-3xl bg-[#3A2A20] border border-[#6B4A35] shadow-2xl text-center"
            >

                <div className="flex justify-center mb-6">
                    <BrandLogo linkTo="/" />
                </div>

                {loading ? (
                    <>
                        <Loader2 className="w-14 h-14 text-[#C9A66B] animate-spin mx-auto mb-5" />

                        <h2 className="text-xl font-bold text-[#F7F1E8]">
                            Verifying Your Email
                        </h2>

                        <p className="text-sm text-[#B89B7A] mt-3">
                            Please wait while we verify your email address.
                        </p>
                    </>
                ) : (
                    <>
                        {success ? (
                            <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-5" />
                        ) : (
                            <XCircle className="w-16 h-16 text-rose-400 mx-auto mb-5" />
                        )}

                        <h2 className="text-xl font-bold text-[#F7F1E8]">
                            {success
                                ? 'Email Verified!'
                                : 'Verification Failed'}
                        </h2>

                        <p className="text-sm text-[#B89B7A] mt-3 mb-7">
                            {message}
                        </p>

                        <Link
                            to="/login"
                            className="inline-flex justify-center w-full py-3 rounded-xl bg-[#C9A66B] hover:bg-[#B58A4A] text-[#2B211B] font-semibold text-sm transition-colors"
                        >
                            {success ? 'Continue to Login' : 'Go to Login'}
                        </Link>
                    </>
                )}

            </motion.div>
        </div>
    );
}