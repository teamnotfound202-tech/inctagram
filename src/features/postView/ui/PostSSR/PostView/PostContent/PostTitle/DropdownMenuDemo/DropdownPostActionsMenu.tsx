import * as React from "react";
import {DropdownMenu} from "radix-ui";
import Bucket from "../../../Icons/Bucket.svg"
import Copy from "../../../Icons/copy.svg"
import Edit from "../../../Icons/edit-2-outline.svg"
import Unfollow from "../../../Icons/person-remove-outline.svg"
import s from "./DropdownPostActionsMenu.module.scss";
import DotsHorizontalIcon from "@/features/postView/ui/PostSSR/PostView/Icons/DotsHorizontal.svg";

type Props = {
    isPostOwner: boolean
}

const DropdownPostActionsMenu = ({isPostOwner}: Props) => {
    const [bookmarksChecked, setBookmarksChecked] = React.useState(true);
    const [urlsChecked, setUrlsChecked] = React.useState(false);
    const [person, setPerson] = React.useState("pedro");

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button className={s.IconButton} aria-label="Customise options">
                    <DotsHorizontalIcon/>
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content className={s.Content} align={'end'} alignOffset={0}>
                    {isPostOwner && <>
                        <DropdownMenu.Item className={s.Item}>
                            <div><Edit/></div>
                            Edit Post
                        </DropdownMenu.Item>
                        <DropdownMenu.Item className={s.Item}>
                            <div><Bucket/></div>
                            Delete Post
                        </DropdownMenu.Item>
                    </>}

                    {!isPostOwner && <>
                        <DropdownMenu.Item className={s.Item}>
                            <div><Unfollow/></div>
                            Unfollow
                        </DropdownMenu.Item>
                        <DropdownMenu.Item className={s.Item}>
                            <div><Copy/></div>
                            Copy Link
                        </DropdownMenu.Item>
                    </>}
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
};

export default DropdownPostActionsMenu;
