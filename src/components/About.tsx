import { Box, Text, Flex, Heading, CloseButton, IconButton } from '@chakra-ui/react';
import { Tooltip } from "@/components/ui/tooltip"
import { useGameStore } from '../store/gameStore';
import { memberInfo } from '../config/memberInfo';
import { MAX_MEMBERS_DISPLAY } from '../config/constants';
import { Icon } from '@iconify/react';
import "@/components/ui/About.scss"
import { toaster } from '../utils/toaster';

export const About = () => {
    const { setUiView } = useGameStore();

    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toaster.create({
            title: `${label} 已复制`,
            type: 'success',
            duration: 2000,
        });
    };

    return (
        <Box width="100vw" height="100vh" bg="var(--gray-light)" p={8}>
            <Flex justify="space-between" align="center" mb={8} color="var(--gray-dark)">
                <Heading size="xl">// 关于</Heading>
                <CloseButton size="sm" onClick={() => setUiView('editor')} />
            </Flex>

            <Box mb="16px" p={6} borderRadius="lg" bg="var(--black-light)" border="1px solid var(--gray)" alignSelf="stretch">
                <Text fontSize="sm" color="var(--gray)" lineHeight="1.6">
                    本工具仅为玩家社群制作的辅助工具，与游戏官方无任何关联。
                    <br />
                    网站内使用的游戏素材（包括但不限于图片、图标、设计元素）其版权均归属于游戏官方及作者所有。
                    <br />
                    本工具不进行任何商业营利行为。若有任何侵权问题，请联系作者逐光·起航的QQ或邮箱（备选）进行删除或更换。
                </Text>
            </Box>

            <Flex
                mb="8px"
                borderLeft={`4px solid var(--yellow)`}
                w="fit-content"
                bg="linear-gradient(to right, rgba(255, 255, 0, 0.4), transparent)"
                pl="8px"
                gap={"8px"}
                alignItems={"center"}
            >
                <Icon icon="tdesign:member-filled" color="var(--gray-dark)" />
                <Text fontSize="lg" fontWeight="bold" color="var(--gray-dark)">成员 {memberInfo.length} / {MAX_MEMBERS_DISPLAY}</Text>
            </Flex>

            <Flex w="100%" direction="column" gap="16px">
                {memberInfo.map((member, index) => {
                    const isAuthor = member.role === 'author';
                    return (
                        <Flex key={index}
                            bg="var(--black-light)"
                            p={4}
                            borderRadius="lg"
                            mr={4}
                            w="100%"
                            gap={"12px"}
                            boxShadow="md"
                            position="relative"
                            overflow="hidden"
                            border={isAuthor ? "4px solid" : "2px solid var(--green)"}
                            borderImageSource={isAuthor ? "linear-gradient(to right, var(--yellow), var(--black-light))" : undefined}
                            borderImageSlice={isAuthor ? 1 : undefined}
                        >
                            {member.avatar && (
                                <Box
                                    position="absolute"
                                    top="-75%"
                                    right="20%"
                                    width="300px"
                                    height="300px"
                                    backgroundImage={`url(${member.avatar})`}
                                    backgroundSize="contain"
                                    backgroundRepeat="no-repeat"
                                    opacity="0.2"
                                    pointerEvents="none"
                                    maskImage="linear-gradient(to right, transparent, black 30%, black 70%, transparent)"
                                />
                            )}
                            <Box
                                w="80px"
                                h="80px"
                                minWidth="80px"
                                minHeight="80px"
                                border={`2px solid var(${isAuthor ? '--gray-light' : '--green'})`}
                                borderRadius="1px"
                                position="relative"
                            >
                                {member.avatar && (
                                    <img
                                        src={member.avatar}
                                        alt={member.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                )}
                                <Box
                                    position="absolute"
                                    top="0"
                                    left="0"
                                    width="100%"
                                    height="100%"
                                    boxShadow="
                                inset 0 0 12px var(--black-dark),
                                inset 0 0 12px var(--black-dark)
                                "
                                    pointerEvents="none"
                                />
                            </Box>
                            <Flex justify="space-between" w="100%">
                                <Flex direction="column" justifyContent={"space-between"}>
                                    <Box>
                                        <Text fontSize="lg" fontWeight="bold">{member.name}</Text>
                                        <Text color="var(--gray)" pl={"8px"}>{member.message}</Text>
                                    </Box>
                                    <Flex gap={"8px"}>
                                        {
                                            member.tags.map((tag, index) => (
                                                <Box
                                                    key={index}
                                                    bg="var(--black-dark)"
                                                    color="var(--gray-light)"
                                                    borderRadius="999px"
                                                    p={1}
                                                >
                                                    <Box
                                                        borderLeft={`2px solid var(--${tag.color})`}
                                                        pl="4px"
                                                        mx={"8px"}
                                                    >
                                                        <Text fontSize="xs" fontWeight="bold">{tag.name}</Text>
                                                    </Box>
                                                </Box>
                                            ))
                                        }
                                    </Flex>
                                </Flex>
                                <Flex alignItems="center" gap={"8px"}>
                                    {member.mail &&
                                        <Tooltip content="Mail">
                                            <IconButton
                                                rounded="full"
                                                className='member-icon-btn'
                                                onClick={() => handleCopy(member.mail!, "Mail")}
                                            >
                                                <Icon icon="material-symbols:mail" />
                                            </IconButton>
                                        </Tooltip>
                                    }
                                    {member.github &&
                                        <Tooltip content="Github">
                                            <IconButton
                                                rounded="full"
                                                className='member-icon-btn'
                                                onClick={() => handleCopy(member.github!, "Github")}
                                            >
                                                <Icon icon="mingcute:github-fill" />
                                            </IconButton>
                                        </Tooltip>
                                    }
                                    {member.discord &&
                                        <Tooltip content="Discord">
                                            <IconButton
                                                rounded="full"
                                                className='member-icon-btn'
                                                onClick={() => handleCopy(member.discord!, "Discord")}
                                            >
                                                <Icon icon="ic:outline-discord" />
                                            </IconButton>
                                        </Tooltip>
                                    }
                                    {member.qq &&
                                        <Tooltip content="QQ">
                                            <IconButton
                                                rounded="full"
                                                className='member-icon-btn'
                                                onClick={() => handleCopy(member.qq!, "QQ")}
                                            >
                                                <Icon icon="ri:qq-fill" />
                                            </IconButton>
                                        </Tooltip>
                                    }
                                </Flex>
                            </Flex>
                        </Flex>
                    );
                })}
            </Flex>
        </Box >
    );
};