'use client';
import {RegisterForm} from '@/features/auth/register';
import {Container, FormWrapper} from '@/shared/ui';

export default function Page() {

    return <>
        <Container>
            <FormWrapper>
                <RegisterForm/>
            </FormWrapper>
        </Container>
    </>
}