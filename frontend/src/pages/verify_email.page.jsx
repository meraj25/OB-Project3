import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { useVerifyEmailQuery } from "@/lib/api";

function VerifyEmailPage() {
    const { token } = useParams();
    const { isLoading, isSuccess, error } = useVerifyEmailQuery(token);

    if (isLoading) return <p>Verifying your email…</p>;
    if (error) return <p>{error?.data?.message ?? "This verification link is invalid or expired."}</p>;

    return (
        <div>
            <p>Your email has been verified! now you can close this window</p>
            
        </div>
    );
}

export default VerifyEmailPage;