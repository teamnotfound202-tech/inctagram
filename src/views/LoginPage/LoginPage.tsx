import {Container, FormWrapper} from '@/shared/ui';
import {LoginForm} from "@/features/auth/login";
import {PostView} from "@/features/postView/ui/PostView";

export const Login = () => {
    return (
        <Container>
            <FormWrapper>
                <LoginForm/>
                <PostView/> {/*TODO: удалить строку - тест*/}
            </FormWrapper>
        </Container>)
}