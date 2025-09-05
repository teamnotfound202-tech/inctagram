'use client';
import {Container, FormWrapper} from '@/shared/ui';
import {LoginForm} from "@/features/auth/login";

export default function Login() {

    return <>
        <Container>
            <FormWrapper>
                <LoginForm/>
            </FormWrapper>
        </Container>
    </>
}