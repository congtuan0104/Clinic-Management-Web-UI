import { Text, Center, Stack, Grid, GridCol, Button, Card, Image, Group, Anchor, Box, Divider, Badge } from '@mantine/core';
import { PATHS } from '@/config';
import { NewsCard } from '@/components';
import { useQuery } from 'react-query';
import { newsApi } from '@/services';
import { useEffect, useRef, useState } from 'react';
import NewsLogoDefault from '@/assets/images/news-logo.png';
import dayjs from 'dayjs';
import { FaRegCalendar } from "react-icons/fa6";
import { useParams } from 'react-router-dom';

const NewsDetailPage = () => {
    const { id: newsId } = useParams();
    console.log(newsId)
    const { data: news, isFetching } = useQuery(['news', newsId], () =>
        getNewsDetail()
    );

    const getNewsDetail = async () => {
        try {
            const response = await newsApi.getNewsDetail(newsId ?? '');
            return response.data;
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <div className='max-w-screen-xl mx-auto'>
            {news && 
            (<Card withBorder radius="md" w={'100%'} h={'100%'} bg={'white'} my={20}>
                <Card.Section>
                    <Box w={'100%'} h={'100%'}>
                        <Image src={news.logo} fallbackSrc={NewsLogoDefault} height={'100%'} />
                    </Box>

                </Card.Section>
                <Card.Section m={5}>
                    <Center>
                        <Text mt={10} size='25px' fw={700} c={'primary'}>
                            {news.title}
                        </Text>
                    </Center>
                </Card.Section>
                <Group>
            <FaRegCalendar/>
            <Text><b>{dayjs(news.createdAt).format('DD/MM/YYYY')}</b></Text>
        </Group>
                <Divider my={'sm'} />
                <div
                    className="ml-[10px]"
                    dangerouslySetInnerHTML={{ __html: news.content || '' }}>
                  </div>
            </Card>)}

        </div>
    );
};

export default NewsDetailPage;
