"use client";
import Login from "@/app/(auth)/login/page";
import axios from "axios";

axios.defaults.baseURL = 'http://localhost:5000'

export default function Home() {
    return (
        <Login/>
    );
}