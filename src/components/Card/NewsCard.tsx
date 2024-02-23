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
		<Stack className='rounded-md p-3 border border-solid border-primary-100 bg-white'>
			<Group align='flex-start'>
				<Box w={150} h={100} component={Link} to={`${PATHS.NEWS}/${news.id}`}>
					<Image src={news.logo} fallbackSrc={NewsLogoDefault} height={100} radius={'md'} />
				</Box>
				<Stack gap={5}>
					<Anchor fz="md" fw={700} maw={380} c={'black'} component={Link} to={`${PATHS.NEWS}/${news.id}`}>
						{news.title}
					</Anchor>

					<Group>
						<FaRegCalendar color={'gray'} />
						<Text c={'gray.5'}><b>{dayjs(news.createdAt).format('DD/MM/YYYY')}</b></Text>
					</Group>
					<Group>

						<Text component={Link} to={`${PATHS.CLINICS}/${news.clinicId}`} c={'gray.5'}>{news.clinicName}</Text>
					</Group>
				</Stack>
			</Group>
			<div className='bg-black-10 p-2 rounded-md'>
				<div className='text-justify line-clamp-2 text-gray-600 '
					dangerouslySetInnerHTML={{ __html: news.content || '' }}>
				</div>
				<Anchor ml='auto' mr={0} underline='always' component={Link} to={`${PATHS.NEWS}/${news.id}`}>Xem chi tiết</Anchor>
			</div>
		</Stack>
	);
};

export default NewsCard;

