import { Text, Center, Stack, Grid, GridCol, Button, Card, Image, Group, Anchor, Box, Divider, Badge, TextInput, Pagination } from '@mantine/core';
import { PATHS } from '@/config';
import { NewsCard } from '@/components';
import { useQuery } from 'react-query';
import { newsApi } from '@/services';
import { useEffect, useRef, useState } from 'react';
import NewsLogoDefault from '@/assets/images/news-logo.png';
import { INews } from '@/types';
import { MdOutlineNavigateNext } from "react-icons/md";
import { Link } from 'react-router-dom';
import { CiSearch } from 'react-icons/ci';
import { useDebouncedState } from '@mantine/hooks';

const NewsPage = () => {
	const [pageIndex, setPageIndex] = useState(0);
	const firstNewsRef = useRef<INews | null>(null);
	const [searchValue, setSearchValue] = useDebouncedState('', 500);
	const [activePage, setPage] = useState(1);
	const [total, setTotal] = useState(0);
	const pageSize = 4;

	useEffect(() => {
		const updateTotal = async () => {
			const result = await getTotal();
			setTotal(result);
		};
		updateTotal();
	}, []);
	const getTotal = async () => {
		try {
			const response = await newsApi.getNews({});
			return Math.ceil((response.data?.total ?? 0) / pageSize);
		} catch (error) {
			console.log(error);
			return 0;
		}
	};

	const { data: news, isFetching } = useQuery(['news', activePage, searchValue], () =>
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
				title: searchValue,
				isShow: true,
				pageSize: pageSize,
				pageIndex: activePage - 1,
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
			<Stack align='center'>
				<Text fw={700} size='30px' m={20}>Tin tức - Thông báo</Text>
				<Text size='15px'>Tổng hợp tin tức, thông báo từ tất cả các phòng khám cùng những thông tin y tế bổ ích</Text>
				<TextInput
					w={660}
					size='lg'
					radius={'md'}
					leftSection={<CiSearch size={26} />}
					placeholder='Tìm kiếm tin tức'
					onChange={(event) => setSearchValue(event.currentTarget.value)}
				/>
			</Stack>
			<Stack>
				<Grid pt={30} pb={30} grow gutter="xl">
					<GridCol span={6} >
						{firstNewsRef && (
							<Card withBorder radius="md" w={'100%'} h={'100%'} bg={'white'}>
								<Card.Section>
									<Box w={'100%'} h={'100%'}>
										<Image src={firstNewsRef.current?.logo} fallbackSrc={NewsLogoDefault} height={'100%'} />
									</Box>

								</Card.Section>
								<Card.Section m={5}>
									<Center>
										<Text mt={10} size='25px' fw={700}>
											{firstNewsRef.current?.title}
										</Text>
									</Center>
								</Card.Section>
								<Divider my={'sm'} />
								<Text ta='justify' style={{ display: '-webkit-box', WebkitLineClamp: 20, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
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
					<GridCol span={6}>
						<Stack>
							{news &&
								news.map((newsItem) => (
									<NewsCard news={newsItem} />
								))}
						</Stack>
						{news && news?.length > 0 &&
							<Group align='center' justify='center' mt={10} bg='white' className='rounded-md py-2'>
								<Pagination total={total} value={activePage} onChange={setPage} mt="sm" />
							</Group>}
					</GridCol>
				</Grid>
			</Stack>
		</div>
	);
};

export default NewsPage;
