import {ReactNode} from "react";
import {Header} from "@/widgets/Header/Header";

export default function AgreementsLayout({children}: { children: ReactNode }) {
    return <>
        <Header agreement={true} isLogin={false} notification={0}/>
        {children}
    </>
}