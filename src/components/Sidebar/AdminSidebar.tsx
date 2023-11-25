// import { RiMenuFill } from "react-icons/ri";

// const mockdata = [
//   { label: 'Dashboard', icon: RiMenuFill, link: '/admin/dashboard' },
//   {
//     label: 'Market news',
//     icon: RiMenuFill,
//     initiallyOpened: true,
//     links: [
//       { label: 'Overview', link: '/' },
//       { label: 'Forecasts', link: '/' },
//       { label: 'Outlook', link: '/' },
//       { label: 'Real time', link: '/' },
//     ],
//   },
//   {
//     label: 'Releases',
//     icon: RiMenuFill,
//     links: [
//       { label: 'Upcoming releases', link: '/' },
//       { label: 'Previous releases', link: '/' },
//       { label: 'Releases schedule', link: '/' },
//     ],
//   },
//   { label: 'Analytics', icon: RiMenuFill },
//   { label: 'Contracts', icon: RiMenuFill },
//   { label: 'Settings', icon: RiMenuFill },
//   {
//     label: 'Security',
//     icon: RiMenuFill,
//     links: [
//       { label: 'Enable 2FA', link: '/' },
//       { label: 'Change password', link: '/' },
//       { label: 'Recovery codes', link: '/' },
//     ],
//   },
// ];

// export function NavbarNested() {
//   const links = mockdata.map((item) => <LinksGroup {...item} key={item.label} />);

//   return (
//     <nav className={classes.navbar}>
//       <div className={classes.header}>
//         <Group justify="space-between">
//           <Logo style={{ width: rem(120) }} />
//           <Code fw={700}>v3.1.2</Code>
//         </Group>
//       </div>

//       <ScrollArea className={classes.links}>
//         <div className={classes.linksInner}>{links}</div>
//       </ScrollArea>

//       <div className={classes.footer}>
//         <UserButton />
//       </div>
//     </nav>
//   );
// }