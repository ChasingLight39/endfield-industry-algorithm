import EddyImg from "@/assets/members/eddy3721.gif"
import TaTaImg from "@/assets/members/tata.png"

export interface MemberInfo {
    name: string;
    avatar: string;
    message: string;
    tags: { name: string; color: string }[];
    role: 'author' | 'contributor';
    mail: string;
    github: string;
    discord: string;
    qq: string;
}

export const memberInfo: MemberInfo[] = [
    {
        name: "大木",
        avatar: EddyImg,
        message: "咕咕嘎嘎",
        tags: [
            { name: "作者", color: "yellow" },
            { name: "W公司員工", color: "green" },
        ],
        role: 'author',
        mail: "eddyqwq@gmail.com",
        github: "https://github.com/eddy3721",
        discord: "https://discord.gg/rQAJv5kUPQ",
        qq: "1082846038",
    },
    {
        name: "逐光·起航",
        avatar: "",
        message: "咕咕嘎嘎",
        tags: [
            { name: "作者", color: "green" }
        ],
        role: 'author',
        mail: "EndIndAlgorithm@163.com",
        github: "https://github.com/ChasingLight39",
        discord: "",
        qq: "1196716061",
    },
    {
        name: "塔塔",
        avatar: TaTaImg,
        message: "● v ●",
        tags: [
            { name: "吉祥物", color: "green" },
            { name: "對超域專家", color: "green" }
        ],
        role: 'contributor',
        mail: "",
        github: "",
        discord: "",
        qq: "",
    }
];
