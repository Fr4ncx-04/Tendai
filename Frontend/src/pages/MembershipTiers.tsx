
// Define la interfaz para los niveles de membresía
interface MembershipTier {
  name: string;
  price: number;
  color: string;
  benefits: string[];
}

// Define la lista de niveles de membresía
const membershipTiers: MembershipTier[] = [
  {
    name: 'Bronce',
    price: 199,
    color: 'bg-amber-700',
    benefits: ['Obten un estuche al realizar una compra durante el mes de membresia'],
  },
  {
    name: 'Plateado',
    price: 349,
    color: 'bg-gray-500',
    benefits: ['Obten un mouse por dos compras dentro del mes de membresia'],
  },
  {
    name: 'Oro',
    price: 529,
    color: 'bg-yellow-500',
    benefits: ['Obten un 10% de descuento en un equipo durante el mes de membresia'],
  },
  {
    name: 'Platino',
    price: 799,
    color: 'bg-blue-700',
    benefits: ['Obten un 15% de descuento en un equipo durante el mes de membresia'],
  },
  {
    name: 'Diamante',
    price: 1000,
    color: 'bg-blue-300',
    benefits: ['Obten un 20% de descuento en un equipo durante el mes de membresia'],
  },
];

// Exporta la lista de niveles de membresía
export default membershipTiers;
