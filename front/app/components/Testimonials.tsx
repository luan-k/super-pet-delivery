import { FaPaw, FaStar } from "react-icons/fa6";
import Image from "next/image";
import TestBg1 from "../../public/static/images/TestimonialBackground1.png";
import TestBg2 from "../../public/static/images/TestimonialBackground2.png";
import TestBg3 from "../../public/static/images/TestimonialBackground3.png";
import TestChat1 from "../../public/static/images/TestimonialChat1.png";
import TestChat2 from "../../public/static/images/TestimonialChat2.png";
import TestChat3 from "../../public/static/images/TestimonialChat3.png";

export default function Testimonials() {
    return (
        <div className="wk-testimonials">
            <div className="container py-40">
                <div className="text-4xl text-front-blue text-center flex justify-center gap-7">
                    <FaPaw /> Depoimentos
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 relative h-full gap-20 mt-20">
                    <div className="wk-testimonial">
                        <div className="wk-testimonial__pet">

                        </div>
                        <div className="wk-testimonial__chat">
                            <div className="wk-testimonial__stars color-1">
                                <FaStar />
                                <FaStar />
                                <FaStar />
                                <FaStar />
                                <FaStar />
                            </div>
                            <div className="wk-testimonial__text text-lg text-black text-center ">"Quando o meu humano pede a minha comida, o pessoal da <b>Super Pet Delivery</b> entrega <b>super rápido</b>."</div>
                            <div className="wk-testimonial__author text-xl text-black text-right font-bold">Luke Skywalker, 1 Ano</div>
                            <Image draggable={false} src={TestChat1} alt="" />
                        </div>
                    </div>
                    <div className="wk-testimonial">
                        <div className="wk-testimonial__pet">

                        </div>
                        <div className="wk-testimonial__chat">
                            <div className="wk-testimonial__stars color-2">
                                <FaStar />
                                <FaStar />
                                <FaStar />
                                <FaStar />
                                <FaStar />
                            </div>
                            <div className="wk-testimonial__text text-lg text-black text-center ">"Todo mundo que me conhece sabe que não gosto de motos, mas a moto do pessoal da <b>Super Pet Delivery</b> é <b>uma exceção</b>, já que depois da vinda deles ganho muita coisa boa dos meus humanos"</div>
                            <div className="wk-testimonial__author text-xl text-black text-right font-bold">Russo, 6 Anos</div>
                            <Image draggable={false} src={TestChat2} alt="" />
                        </div>
                    </div>
                    <div className="wk-testimonial">
                        <div className="wk-testimonial__pet">

                        </div>
                        <div className="wk-testimonial__chat">
                            <div className="wk-testimonial__stars color-3">
                                <FaStar />
                                <FaStar />
                                <FaStar />
                                <FaStar />
                                <FaStar />
                            </div>
                            <div className="wk-testimonial__text text-lg text-black text-center ">"Dizem que eu sou uma <b>Pet Rainha</b> e que só como e bebo do melhor! Meus humanos, por razões óbvias, escolheram a <b>Super Pet Delivery</b>, que é <b>simplesmente a melhor</b> da grande Florianópolis"</div>
                            <div className="wk-testimonial__author text-xl text-black text-right font-bold">Milady , 2 Anos</div>
                            <Image draggable={false} src={TestChat3} alt="" />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}