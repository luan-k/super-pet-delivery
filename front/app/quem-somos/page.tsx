import React from "react";
import Image from "next/image";
import quemSomosImage from "../../public/static/images/quem-somos.jpg";
import "../styles/public-components/parts/Header.scss";
import "../styles/public-components/parts/quem-somos.scss";

export default function QuemSomos() {
  return (
    <main className='py-48 flex bg-gray-50 quem-somos'>
      <div className='container text-black flex items-center'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-24'>
          <div className='relative flex items-center quem-somos__image-wrapper'>
            <Image
              src={quemSomosImage}
              className='object-cover m-auto'
              alt='Quem Somos'
              fill={true}
            />
          </div>
          <div className='text-2xl flex items-start flex-col gap-12'>
            <h1 className='text-5xl font-semibold text-front-blue text-left'>
              Quem Somos
            </h1>

            <p>
              Bem-vindo à Super Pet Delivery, sua solução confiável para a
              nutrição e o bem-estar dos seus melhores amigos de quatro patas.
              Fundada por apaixonados por animais, nossa missão é oferecer uma
              experiência de compra conveniente, rápida e segura para todos os
              donos de cães e gatos.
            </p>
            <p>
              Entendemos que cada pet é único e merece o melhor. Por isso,
              selecionamos cuidadosamente uma ampla gama de rações de alta
              qualidade, atendendo às diversas necessidades dietéticas de cães e
              gatos, desde filhotes até os mais idosos. Nosso compromisso é com
              a saúde e a felicidade dos seus pets, e trabalhamos
              incansavelmente para garantir que eles recebam o alimento ideal
              para uma vida longa e saudável.
            </p>
            <p>
              Na Super Pet Delivery, valorizamos a praticidade e o conforto dos
              nossos clientes. Com apenas alguns cliques, você pode fazer seu
              pedido online pelo WhatsApp e receber os produtos diretamente em
              sua casa, com a rapidez e eficiência que só a Super Pet Delivery
              oferece. Estamos sempre prontos para atender às suas necessidades
              e as do seu pet, com um serviço de atendimento ao cliente amigável
              e especializado.
            </p>
            <p>
              Junte-se à família Super Pet Delivery e descubra a maneira mais
              fácil e confiável de cuidar da alimentação do seu pet.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
