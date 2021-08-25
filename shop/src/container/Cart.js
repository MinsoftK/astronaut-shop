import React, { useEffect, useState, memo } from 'react';
import { Table, Button } from 'react-bootstrap';
import { Checkbox } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import './Cart.css';

const Cart = memo((props) => {
	let state = useSelector(
		(state) =>
			//redux안에 있던 모든 state
			state.remainReducer
	);
	let dispatch = useDispatch();

	let [selectPay, setSelectPay] = useState(0); //각각의 상품 가격을 저장하는 state
	let [isselect, setIsSelect] = useState([]); //체크박스가 선택되었는지 저장하는 state
	let [totalPay, setTotalPay] = useState(0); //선택한 상품의 총 결제 금액을 저장
	//처음 렌더링될 때
	useEffect(() => {
		console.log('훅을 이용해 redux state 가져오기', state);
		console.log('state', state);

		//렌더링될때 상품의 개수만큼 checkbox state를 저장할 obj 생성
		let copybox = [];
		let copypay = [];
		for (let i = 0; i < state.length; i++) {
			copybox.push(false); //선택 박스 false 초기화
			copypay.push(state[i].price * state[i].quan); // 상품 각각의 결제가격 초기화
		}
		setIsSelect(copybox);
		setSelectPay(copypay);
	}, []);

	//선택된 상품이나 가격이 변할 때, 재렌더링
	useEffect(() => {
		console.log('선택박스 변화', isselect);
		let total = 0;
		for (let i = 0; i < state.length; i++) {
			if (isselect[i] === true) {
				total += selectPay[i];
			}
		}
		setTotalPay(total);
	}, [isselect, selectPay, totalPay]);

	//체크된 상품의 총 상품금액 업데이트
	const onChange = (e) => {
		console.log(e);
		console.log(`checked = ${e.target.checked} , i = ${e.target.checkNumber}`);

		//copy의 checkNumber 인덱스 값을 변경해준다.
		let copy = [...isselect];
		copy[e.target.checkNumber] = e.target.checked;
		setIsSelect(copy);
	};
	const onClickBtn = (i) => {
		//상품의 개수가 1보다 크고, 상품이 선택되었을 때만 가격을 변경해준다.
		let pay = [...selectPay];
		pay[i] = state[i].quan * state[i].price;
		console.log(pay);
		setSelectPay(pay);
	};

	return (
		<>
			<Table className="cart-display-item" bordered>
				<thead>
					<tr>
						<th>선택</th>
						<th>상품정보</th>
						<th>상품명</th>
						<th>수량</th>
						<th>판매금액</th>
						<th>삭제</th>
					</tr>
				</thead>
				<tbody>
					{state.map((item, i) => {
						//redux의 상품들 (장바구니에 저장된 상품들)
						let total = item.price * item.quan;
						return (
							<tr key={i}>
								<td>
									<Checkbox
										checkNumber={i}
										item={item}
										onChange={onChange}></Checkbox>
								</td>
								<td>
									<img
										style={{ width: '220px', height: '220px' }}
										src={item.imageUrl}></img>
								</td>
								<td>{item.name}</td>
								<td>
									<Button
										variant="light"
										onClick={() => {
											dispatch({
												type: '수량감소',
												data: i,
											});
											onClickBtn(i);
										}}>
										-
									</Button>
									{' ' + item.quan + ' '}
									<Button
										variant="light"
										onClick={() => {
											console.log('isselect[i]', isselect[i], i);
											dispatch({ type: '수량증가', data: i });
											onClickBtn(i);
										}}>
										+
									</Button>
								</td>
								<td>
									{total
										.toString()
										.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',') + '원'}
								</td>
								<td>
									<Button
										variant="danger"
										onClick={() => {
											dispatch({ type: '항목삭제', data: i });
											// setPay(pay - item.price * item.quan);
										}}>
										X
									</Button>
								</td>
							</tr>
						);
					})}
				</tbody>
			</Table>
			<div className="payment">
				<span>총 결제금액 : </span>
				<span>
					{totalPay.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',') +
						'원'}
				</span>
				<div>
					<Button variant="danger" style={{ marginTop: '20px' }}>
						결제
					</Button>
				</div>
			</div>
		</>
	);
});
// const 함수명 = (state) => {
// 	console.log('state', state);
// 	return {
// 		state: state.remainReducer,
// 		alert: state.alert,
// 	};
// };
// export default connect(함수명)(Cart);
export default Cart;
