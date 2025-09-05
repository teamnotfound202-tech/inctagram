'use client'

import {Header} from "@/widgets/Header/Header";
import {RegisterForm} from "@/features/auth/register";

export default function Home() {

    return (
        <div>
            <Header isLogin={false} notification={11}/>
            <main style={{height: '100vh', maxWidth: '1280px', display: 'flex', flexDirection: 'column',  alignItems: 'center', justifyContent: 'center'}}>
                <RegisterForm/>
            </main>
        </div>
    );
}


