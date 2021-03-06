import React from 'react'
import PropTypes from 'prop-types'
import Header from './Header'
import Inventory from './Inventory'
import Order from './Order'
import sampleFishes from '../sample-fishes'
import Fish from './Fish'
import base from '../base'


class App extends React.Component {


	state = {
		fishes: {},
		order: {}
	}

	static propTypes = {
		match: PropTypes.object
	}
	componentDidMount() {

		const { params } = this.props.match
		// FIRST REINSTATE LOCAL STORAGE
		const localStorageRef = localStorage.getItem(params.storeId)
		if (localStorageRef) {
			this.setState({order: JSON.parse(localStorageRef)})
		}

		this.ref = base.syncState(`${params.storeId}/fishes`,
		{
			context: this,
			state: 'fishes'
		})
	}

	componentDidUpdate() {
		console.log(this.state.order)
		localStorage.setItem(
			this.props.match.params.storeId,
			JSON.stringify(this.state.order)
		)
	}

	componentWillUnmount() {
		base.removeBinding(this.ref)
	}

	addFish = (fish) => {
		// TAKE COPY OF EXISTING STATE
		const fishes = {... this.state.fishes}
		// ADD NEW FISH FROM AddFishForm TO THAT FISHES VARIABLE
		fishes[`fish${Date.now()}`] = fish
		// SET THE NEW FISHES TO STATE
		this.setState({fishes})
	}

	updateFish = (key, updatedFish) => {
		// TAKE A COPY OF CURRENT STATE
		const fishes = {...this.state.fishes}
		// UPDATE THAT STATE
		fishes[key] = updatedFish
		// SET THAT TO STATE
		this.setState({fishes})
	}

	deleteFish = key => {
		// TAKE A COPY OF CURRENT STATE
		const fishes = {...this.state.fishes}
		// UPDATE THAT STATE
		fishes[key] = null
		// SET THAT TO STATE
		this.setState({fishes})
	}

	loadSampleFishes = () => {
		this.setState({fishes:sampleFishes})
	}

	addToOrder = (key) => {
		// TAKE COPY OF EXISTING STATE
		const order = {... this.state.order}
		// EITHER ADD TO THE ORDER OR UPDATE THE NUMBER IN THE ORDER
		order[key] = order[key] + 1 || 1
		// CALL SETSTATE TO UPDATE STATE OBJECT
		this.setState({order})
	}

	removeFromOrder = (key) => {
		// TAKE COPY OF EXISTING STATE
		const order = {... this.state.order}
		// REMOVE ITEM FROM STATE
		delete order[key]
		// CALL SETSTATE TO UPDATE STATE OBJECT
		this.setState({order})
	}


	render () {
		return (
			<div className='catch-of-the-day'>
				<div className='menu'>
					<Header tagline='Fresh Seafood Market'/>
					<ul className='fishes'>
						{
						Object.keys(this.state.fishes)
						.map(key =>
							<Fish
								key={key}
								index={key}
								details={this.state.fishes[key]}
								addToOrder={this.addToOrder}
							/>
							)
						}
					</ul>
				</div>
				<Order
					fishes={this.state.fishes}
					order={this.state.order}
					removeFromOrder={this.removeFromOrder}
				/>
				<Inventory
					addFish={this.addFish}
					updateFish={this.updateFish}
					deleteFish={this.deleteFish}
					loadSampleFishes={this.loadSampleFishes}
					fishes={this.state.fishes}
					storeId={this.props.match.params.storeId}
				/>
			</div>
		)
	}
}

export default App