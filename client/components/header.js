import Link from 'next/link';

const Header = ({ currentUser }) => {
	const links = [
		!currentUser && { label: 'Sign up', href: '/auth/signup' },
		!currentUser && { label: 'Sign in', href: '/auth/signin' },
		currentUser && { label: 'Sing Out', href: '/auth/signout' }
	].filter(linkConfig => linkConfig).map(({ label, href }) => (
		<li key={href}>
			<Link href={href}>
				<a className="nav-link">{label}</a>
			</Link>
		</li>
	));

	return <nav className="navbar navbar-light bg-light">
		<Link href="/">
			<a className="navbar-brand">GitTix</a>
		</Link>

		<div className="d-flex justify-content-end">
			<ul className="nav d-flex align-items-center">
				{links}
			</ul>
		</div>
	</nav>
}
export default Header;