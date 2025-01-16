"use client";
import React from "react";
import Header from "./layout/Header";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Header />
            {children}
        </>
    );
}
