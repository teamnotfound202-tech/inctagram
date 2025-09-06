'use client';
import {RegisterForm} from '@/features/auth/register';
import {Container, FormWrapper} from '@/shared/ui';
import {Congratulations} from '@/widgets/Congratulations/Congratulations';
import {Verification} from '@/widgets/Verification/Verification';

export default function Page() {

    return <>
        <Container>
            <FormWrapper>
                <RegisterForm/>
            </FormWrapper>
        </Container>
        {/*<Congratulations/>*/}
        {/*<Verification/>*/}
    </>
}