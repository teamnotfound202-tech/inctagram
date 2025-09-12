export type Text =
    | 'Feed'
    | 'Create'
    | 'My Profile'
    | 'Messenger'
    | 'Search'
    | 'Statistics'
    | 'Favorites'
    | 'Log Out';
export type SideBarData ={
    key:string
    text:Text
    link:string
    isDisabled:boolean
    onclick?:boolean
}
export const sideBarData:SideBarData[] = [
    {
        key:'Feed',
        text:'Feed',
        link:'',
        isDisabled:false
    },
    {
        key:'Create',
        text:'Create',
        link:'',
        isDisabled:false
    },
    {
        key:'My Profile',
        text:'My Profile',
        link:'',
        isDisabled:false
    },
    {
        key:'Messenger',
        text:'Messenger',
        link:'',
        isDisabled:false
    },
    {
        key:'Search',
        text:'Search',
        link:'',
        isDisabled:false
    },
    {
        key:'Statistics',
        text:'Statistics',
        link:'',
        isDisabled:false
    },
    {
        key:'Favorites',
        text:'Favorites',
        link:'',
        isDisabled:false
    },
    {
        key:'Log Out',
        text:'Log Out',
        link:'',
        isDisabled:false,
        onclick:true
    },

]