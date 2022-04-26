import React from "react";

class Accounts extends React.Component {
	render() {
		const { account } = this.props;
		const addressLength = account.length;
		return (
			<div className="text-center">
				{account
					? (account.slice(0, 5) + "..." + account.slice(addressLength - 5, addressLength))
					: "0x"
				}
			</div>
		);
	}
}

export default Accounts;