import {Container, FormWrapper} from '@/shared/ui';
import {LoginForm} from "@/features/auth/login";

export const Login = () => {
    return (
        <Container>
            <FormWrapper>
                <LoginForm/>
            </FormWrapper>
        </Container>)
}