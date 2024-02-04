import { Text, Center, Stack, Grid, GridCol, Button, Card, Image, Group, Anchor, Box, Divider, Badge } from '@mantine/core';
import { PATHS } from '@/config';
import { NewsCard } from '@/components';
import { useQuery } from 'react-query';
import { newsApi } from '@/services';
import { useEffect, useRef, useState } from 'react';
import NewsLogoDefault from '@/assets/images/news-logo.png';
import { INews } from '@/types';
import { MdOutlineNavigateNext } from "react-icons/md";
import { Link } from 'react-router-dom';

const NewsPage = () => {
    const [pageIndex, setPageIndex] = useState(1);
    const firstNewsRef = useRef<INews | null>(null);

    const pageSize = 4;

    const { data: news, isFetching } = useQuery(['news', pageIndex], () =>
        getNews()
    );

    useEffect(() => {
        if (news && news.length > 0 && !firstNewsRef.current) {
            firstNewsRef.current = news[0];
        }
    }, [news]);

    const getNews = async () => {
        try {
            const response = await newsApi.getNews({
                isShow: true,
                pageSize: String(pageSize),
                pageIndex: String(pageIndex),
            });
            return response.data?.data;
        } catch (error) {
            console.log(error);
        }
    };

    const handleNextPage = () => {
        setPageIndex((prevIndex) => prevIndex + 1);
    };

    const handlePrevPage = () => {
        setPageIndex((prevIndex) => Math.max(prevIndex - 1, 1));
    };


    return (
        <div className='max-w-screen-xl mx-auto'>
            <Stack>
                <Grid pt={30} pb={30} grow gutter="xl">
                    <GridCol span={7} >
                        {firstNewsRef && (
                            <Card withBorder radius="md" w={'100%'} h={'100%'} bg={'white'}>
                                <Card.Section>
                                    <Box w={'100%'} h={'100%'}>
                                        <Image src={firstNewsRef.current?.logo} fallbackSrc={NewsLogoDefault} height={'100%'} />
                                    </Box>

                                </Card.Section>
                                <Card.Section m={5}>
                                    <Center>
                                        <Text mt={10} size='25px' fw={700} c={'primary'}>
                                            {firstNewsRef.current?.title}
                                        </Text>
                                    </Center>
                                </Card.Section>
                                <Divider my={'sm'}/>
                                <Text style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    <div
                                        dangerouslySetInnerHTML={{ __html: firstNewsRef.current?.content || '' }}>
                                    </div>
                                </Text>
                                <Card.Section mr={20} my={10} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                    <Anchor underline='always' component={Link} to={`${PATHS.NEWS}/${firstNewsRef.current?.id}`}>Xem chi tiết</Anchor>
                                </Card.Section>
                            </Card>
                        )}
                    </GridCol>
                    <GridCol span={5}>
                        <Stack h={500}>
                            {news &&
                                news.map((newsItem, index) => (
                                    <NewsCard news={newsItem} />
                                ))}
                        </Stack>
                        <Group align='center' justify='center' mt={30}>

                            <Button onClick={handlePrevPage} disabled={pageIndex === 1 || isFetching}>
                                Trang trước
                            </Button>
                            <Text mx={2}>Trang {pageIndex}</Text>
                            {(
                                <Button onClick={handleNextPage} disabled={!news || news.length < pageSize || isFetching}>
                                    Trang sau
                                </Button>
                            )}
                        </Group>
                    </GridCol>
                </Grid>
            </Stack>
        </div>
    );
};

export default NewsPage;
