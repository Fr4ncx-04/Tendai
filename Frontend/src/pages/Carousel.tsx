import React, { useEffect } from "react";
import 'bootstrap';

declare global {
    interface Window {
        bootstrap: any; // Puedes usar 'typeof import("bootstrap")' para tipos más precisos si lo prefieres
    }
}

const Carousel: React.FC = () => {
    useEffect(() => {
        // Configura el intervalo para cambiar automáticamente
        const intervalId = setInterval(() => {
            const carouselElement = document.getElementById('carouselExampleIndicators');
            if (carouselElement) {
                const carouselInstance = new window.bootstrap.Carousel(carouselElement);
                carouselInstance.next();
            }
        }, 3000); // Cambia de imagen cada 3 segundos

        // Limpia el intervalo al desmontar el componente
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div>
            <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-indicators">
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                </div>
                <div className="carousel-inner">
                    <div className="carousel-item active object-cover rounded-lg overflow-hidden">
                        <img src="/img/Gamer.jpeg" className="d-block w-100" alt="..." /><a href="/Gamer"></a>
                    </div>
                    <div className="carousel-item rounded-lg overflow-hidden">
                        <img src="/img/Gamer2.jpeg" className="d-block w-100" alt="..." />
                    </div>
                    <div className="carousel-item rounded-lg overflow-hidden">
                        <img src="/img/Gamer.jpeg" className="d-block w-100" alt="..." />
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </div>
    );
}

export default Carousel;
