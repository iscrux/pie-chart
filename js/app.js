(function ( $ ) {
	$.fn.createChart = function(slices, doughnut = false) {
		if (!$(this).length) return

		const _container = $(this)
		const _canvas = $('<canvas class="animate-pie-chart" width="300" height="300"></canvas>')
		const _labels = $('<div class="pie-label-container"></div>')

		_container.append(_canvas, _labels)

		const total = slices.reduce((acc, item) => acc + item.value, 0 )
		const circleWidth = _canvas.width()
		const circleHeight = _canvas.height()

		const ctx = _canvas.get(0).getContext("2d")
		let startAngle = 0

		function getCoordsByAngle(angle) {
			const x0 = circleWidth / 2
			const y0 = circleHeight / 2
			const r = x0
			let x = x0 + r * Math.cos(angle)
			let y = y0 + r * Math.sin(angle)
			return { x , y }
		}
		function drawLine(ctx, x, y, color) {
			ctx.beginPath()
			// Передвигает перо в центр круга
			ctx.moveTo(circleWidth / 2, circleHeight / 2);
			// Рисует линию до точки (x, y)
			ctx.lineTo(x, y)
			ctx.lineWidth = 2
			ctx.strokeStyle = color
			ctx.stroke()
			ctx.closePath()
		}
		$.fn.appendLabel = function (startAngle, endAngle, title, content) {
			// Создаем label
			const _label = $(`<div class="pie-label-item"></div>`)
			const _label_title  = $(`<div class="pie-label-item__title"></div>`)
			const _label_content  = $(`<div class="pie-label-item__body"></div>`)

			_label_content.html(content)
			_label_title.html(title)


			_label.append(_label_title, _label_content)
			$(this).append(_label)
			_label.setLabelCSS(startAngle, endAngle)

			return this
		}
		$.fn.setLabelCSS = function (startAngle, endAngle) {
			const modifier = 5
			const x0 = circleWidth / 2
			const y0 = circleHeight / 2

			const height = $(this).height()
			const width = $(this).width()

			let {x , y} = getCoordsByAngle(
				startAngle + (endAngle - startAngle) / 2
			)

			if (y < y0) {
				y = y - height - modifier
				if (x < x0) x = x - width - modifier
			} else {
				y = y + modifier
				if (x < x0) x = x - width - modifier
			}

			const elClass = x < x0
				? "pie-label-item--left"
				: "pie-label-item--right";

			return $(this)
				.addClass(elClass)
				.css({ left: x, top: y })
		}
		slices.forEach(item => {
			let response
			const value = item.value
			const percent = Math.round(value / total * 100)
			const angle = (value / total) * Math.PI * 2
			const endAngle = startAngle + angle

			// Рисуем слайс
			ctx.beginPath()
			ctx.moveTo(circleWidth / 2, circleHeight / 2)
			ctx.arc(
				circleWidth / 2,
				circleHeight / 2,
				circleWidth / 2,
				startAngle,
				endAngle,
			)
			ctx.closePath()
			ctx.fillStyle = item.color
			ctx.fill()

			// Рисуем линию 1
			response = getCoordsByAngle(startAngle)
			drawLine(ctx, response.x, response.y, '#fff')

			// Рисуем линию 2
			response = getCoordsByAngle(endAngle)
			drawLine(ctx, response.x, response.y, '#fff')

			_labels.appendLabel(startAngle, endAngle, item.title, `${percent}% (${item.value} шт)`)

			// Обновляем угол
			startAngle += angle
		})

		if (doughnut) {
			ctx.beginPath();
			ctx.arc(circleWidth / 2, circleHeight / 2, circleWidth / 4, 0, 2 * Math.PI, false);
			ctx.fillStyle = '#fff';
			ctx.fill();
		}

		return this;
	}
}(jQuery));

$(function () {
	$('#pie-chart').createChart([
		{
			title: 'Item 1',
			value: 41,
			color: '#6019f8'
		},
		{
			title: 'Item 2',
			value: 37,
			color: '#25DBF5'
		},
		{
			title: 'Item 3',
			value: 9,
			color: '#16c53d'
		},
	])
	$('#pie-chart-doughnut').createChart([
		{
			title: 'Item 4',
			value: 41,
			color: '#3bff00'
		},
		{
			title: 'Item 5',
			value: 37,
			color: '#ff0000'
		},
		{
			title: 'Item 6',
			value: 9,
			color: '#00ffa2'
		},
	], true)
})
