//import {Suspense} from "react";

import { notFound } from "next/navigation";
import Image from "next/image";
import BookEvent from "@/components/BookEvent";

//import EventDetails from "@/components/EventDetails";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetaiItem = ({icon, alt, label}: {icon: string, alt: string, label: string}) => (
    <div className="flex flex-row gap-2 items-center">
        <Image src={icon} alt={alt} width={17} height={17}/>
        <p>{label}</p>
    </div>
);

const EventAgenda = ({agendaItems}: {agendaItems: string[]}) => (
    <div className="agenda">
        <h2>Event Agenda</h2>
        <ul>
            {agendaItems.map((item) => (
                <li key={item}> {item}</li>
            ))}
        </ul>
    </div>
);   


const EventTags = ({tags}: {tags: string[]}) => (
    <div className="flex flex-row gap-2 flex-wrap">
        {tags.map((tag) => (
            <div className="pill" key={tag}>{tag}</div>
        ))}

    </div>
);  

const EventDetailsPage = async ({ params }: { params: Promise<{ slug: string }>}) => {
    const {slug} = await params;
    let event;
    try {
        const request = await fetch(`${BASE_URL}/api/events/${slug}`, {
            next: { revalidate: 60}
        });
        if (!request.ok) {
            if(request.status === 404) {
                return notFound();
        }
        throw new Error(`Failed to fetch event data: ${request.statusText}`);}

        const response = await request.json();
        event = response;

        if (!event) {
            return notFound();
        }

    } catch (error) {
        console.error("Error fetching event data:", error);
        return notFound();
    }
    
    const {data:{description, image, overview, date, time, location, mode, agenda, audience, tags, organizer}} = event;

    if (!description) return notFound

    const booking = 10;

    return (
        <section id="event">
            <div className="header">
                <h1>Event Description </h1>
                <p>{description} </p>
            </div>

            <div className="details">
                {/* Left Side Booking Form */}
                <div>
                    <Image src={image} alt="Event Banner" width={800} height={800} className="banner"></Image>

                    <section className="flex-col-gap-2">
                        <h2>Overview</h2>
                        <p>{overview}</p>
                    </section>

                    <section className="flex-col-gap-2">
                        <h2>Evente Details</h2>
                        <EventDetaiItem icon="/icons/calendar.svg" alt="date" label={date}/>
                        <EventDetaiItem icon="/icons/clock.svg" alt="time" label={time}/>
                        <EventDetaiItem icon="/icons/pin.svg" alt="location" label={location}/>
                        <EventDetaiItem icon="/icons/mode.svg" alt="mode" label={mode}/>
                        <EventDetaiItem icon="/icons/audience.svg" alt="audience" label={audience}/>
                    </section>

            
                    <EventAgenda agendaItems={JSON.parse(agenda[0])}/>

                    <section className="flex-col-gap-2"> 
                        <h2>About the Organizer</h2>
                        <p>{organizer}</p>
                    </section>
                    <EventTags tags={JSON.parse(tags[0])}/>
                </div>

                {/* Right Side Booking Form */}
                <aside className="booking">
                    <div className="signup-card">
                        <h2>Book your Spot</h2>
                        {booking > 0 ? (
                            <p className="tex-sm">
                                Join {booking} people who have already booked their spot!
                                </p>
                        ) : (
                            <p className="text-sm">Be the first to book your spot!</p>
                        )}

                        <BookEvent/>

                    </div>
                </aside>
            </div>
        </section>

)

}
export default EventDetailsPage