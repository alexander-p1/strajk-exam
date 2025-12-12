import { http, HttpResponse} from "msw"

export const handlers = [
    http.post("https://731xy9c2ak.execute-api.eu-north-1.amazonaws.com/booking", async ({request}) => {
        const body = await request.json()

        const price = (parseInt(body.people) * 120) + (parseInt(body.lanes) * 100)

        return HttpResponse.json({
            bookingDetails: {
                bookingId: "68cf5814-c064-4e92-a890-7e4aaee9e6ca",
                price: price,
                when: body.when,
                lanes: body.lanes,
                people: body.people,
                shoes: body.shoes,
                active: true
            }
        })
    })
]
