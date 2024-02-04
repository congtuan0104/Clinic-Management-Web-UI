import { Paper, Text, Divider, Group, Button, Flex, Box, NumberFormatter, ThemeIcon, Image, Stack, Container, Card, Center, Anchor } from '@mantine/core';
import { FaCheck } from 'react-icons/fa';

import classes from './style.module.css';
import { IClinic, INews, IServicePlan } from '@/types';
import NewsLogoDefault from '@/assets/images/news-logo.png';
import dayjs from 'dayjs';
import { FaRegCalendar } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { PATHS } from '@/config';

/**
 * @param {INews} news
 */
interface INewsCardProps {
    news: INews;
}

// Import necessary components and libraries

const NewsCard = ({ news }: INewsCardProps) => {
    
    return (
        <Group>
        <Box w={150} h={100} component={Link} to={`${PATHS.NEWS}/${news.id}`}>
            <Image src={news.logo} fallbackSrc={NewsLogoDefault} height={100} radius={'md'} />
        </Box>
        <Stack>
        <Text>

        </Text>
        <Anchor fz="md" fw={700} maw={300} c={'black'} component={Link} to={`${PATHS.NEWS}/${news.id}`}>
            {news.title}
        </Anchor>

        <Group>
            <FaRegCalendar color={'gray'}/>
            <Text c={'gray.5'}><b>{dayjs(news.createdAt).format('DD/MM/YYYY')}</b></Text>
        </Group>
        
        </Stack>
        
    </Group>
    
    );
};

export default NewsCard;

