//import {Suspense} from "react";
//import EventDetails from "@/components/EventDetails";

const EventDetailsPage = async ({ params }: { params: Promise<{ slug: string }>}) => {
    const slug = params.then((p) => p.slug);

    return (
        <section id="event">
            <h1>Event Details: <br/> {slug}</h1>
        </section>

        
    )
}
export default EventDetailsPage