'use client';
import {Container, FormWrapper} from '@/shared/ui';
import {LoginForm} from "@/features/auth/login";
import { useState } from 'react';
import {RecoverynForm} from "@/features/auth/passwordRecovering";

export default function Login() {
const [forgotPassword,setForgotPassword] = useState<boolean>(false);
const formChangerHandler = (type:boolean)=>{
    setForgotPassword(type)
}
    return <>
        <Container>
            <FormWrapper>
                {!forgotPassword ? <LoginForm setFormType={formChangerHandler}/>: <RecoverynForm/>}
            </FormWrapper>
        </Container>
    </>
}