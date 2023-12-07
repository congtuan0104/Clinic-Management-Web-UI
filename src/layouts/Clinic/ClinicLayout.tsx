import { ClinicHeader, ClinicSideBar } from '@/components';
import { Box, Divider, Group } from '@mantine/core';

const ClinicLayout = ({ children }: { children: JSX.Element }) => {
    return (
        <Box bg='primary.0' style={{ position: 'relative' }}>
            <ClinicHeader />
            <Divider />
            <Box style={{ display: 'flex', paddingTop: '60px' }}>
                <Box style={{ position: 'fixed', flex: '0'}}>
                    <ClinicSideBar />
                </Box>
                <Box style={{ flex: '1', marginLeft: '250px', padding: '20px', height: '1000px' }}>
                    <main className="max-w-screen-xxl mx-auto">
                        {children}
                    </main>
                </Box>
            </Box>
        </Box>
    );
};

export default ClinicLayout;
