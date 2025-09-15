import {RegisterForm} from '@/features/auth/register';
import {Container, FormWrapper} from '@/shared/ui';

export const RegisterPage = () => {
    return (
        <Container>
            <FormWrapper>
                <RegisterForm />
            </FormWrapper>
        </Container>
    );
}
