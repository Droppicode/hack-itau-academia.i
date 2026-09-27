import { AnimatePresence, motion, type Variants } from "framer-motion";
import { Navigate, Route, Routes, useLocation, useNavigationType } from "react-router-dom";
import { PhoneFrame } from "./components/PhoneFrame";
import { ToastProvider } from "./components/Toast";
import { Home } from "./screens/Home";
import { Pix } from "./screens/Pix";
import { PixDados } from "./screens/PixDados";
import { PixDestinatario } from "./screens/PixDestinatario";
import { PixFormaPagamento } from "./screens/PixFormaPagamento";
import { PixRevisao } from "./screens/PixRevisao";
import { PixSucesso } from "./screens/PixSucesso";
import { PixValor } from "./screens/PixValor";
import { PreLogin } from "./screens/PreLogin";
import { TabPlaceholder } from "./screens/TabPlaceholder";
import { PixProvider } from "./state/PixContext";
import { TrilhaProvider } from "./state/TrilhaContext";
import { Aprofundar } from "./screens/academia/Aprofundar";
import { Intro } from "./screens/academia/Intro";
import { Missoes } from "./screens/academia/Missoes";
import { Trilha } from "./screens/academia/Trilha";
import { Licao } from "./screens/academia/Licao";
import { Vantagens } from "./screens/Vantagens";
import { Cofrinho } from "./screens/Cofrinho";
import { MinhasVantagens } from "./screens/MinhasVantagens";
import { ItauShop } from "./screens/ItauShop";
import { Desafio } from "./screens/academia/Desafio";

type Dir = "push" | "pop" | "fade";

const variants: Variants = {
  initial: (d: Dir) => (d === "fade" ? { opacity: 0 } : { x: d === "push" ? "100%" : "-30%", opacity: d === "push" ? 1 : 0.6 }),
  animate: { x: 0, opacity: 1, zIndex: 1 },
  exit: (d: Dir) =>
    d === "fade" ? { opacity: 0, zIndex: 0 } : { x: d === "push" ? "-30%" : "100%", opacity: d === "push" ? 0.6 : 1, zIndex: d === "push" ? 0 : 2 },
};

function AnimatedRoutes() {
  const location = useLocation();
  const navType = useNavigationType();
  const isTab = (location.state as { tab?: boolean } | null)?.tab === true;
  const dir: Dir = isTab && navType !== "POP" ? "fade" : navType === "POP" ? "pop" : "push";

  return (
    <AnimatePresence initial={false} custom={dir}>
      <motion.div
        key={location.pathname}
        custom={dir}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={dir === "fade" ? { duration: 0.15 } : { type: "tween", ease: [0.32, 0.72, 0, 1], duration: 0.38 }}
        className="absolute inset-0 bg-white shadow-[-8px_0_24px_rgba(0,0,0,0.08)]"
      >
        <Routes location={location}>
          <Route path="/" element={<PreLogin />} />
          <Route path="/home" element={<Home />} />
          <Route path="/extrato" element={<TabPlaceholder path="/extrato" />} />
          <Route path="/pagamentos" element={<TabPlaceholder path="/pagamentos" />} />
          <Route path="/pra-voce" element={<Vantagens />} />
          <Route path="/academia" element={<Navigate to="/academia/trilha" replace />} />
          <Route path="/academia/intro" element={<Intro />} />
          <Route path="/academia/trilha" element={<Trilha />} />
          <Route path="/academia/missoes" element={<Missoes />} />
          <Route path="/academia/licao/:id" element={<Licao />} />
          <Route path="/academia/licao/:id/aprofundar" element={<Aprofundar />} />
          <Route path="/academia/desafio/:unit" element={<Desafio />} />
          <Route path="/cofrinhos" element={<Cofrinho />} />
          <Route path="/minhas-vantagens" element={<MinhasVantagens />} />
          <Route path="/itau-shop" element={<ItauShop />} />
          <Route path="/menu" element={<TabPlaceholder path="/menu" />} />
          <Route path="/pix" element={<Pix />} />
          <Route path="/pix/destinatario" element={<PixDestinatario />} />
          <Route path="/pix/valor" element={<PixValor />} />
          <Route path="/pix/forma-pagamento" element={<PixFormaPagamento />} />
          <Route path="/pix/dados" element={<PixDados />} />
          <Route path="/pix/revisao" element={<PixRevisao />} />
          <Route path="/pix/sucesso" element={<PixSucesso />} />
          <Route path="*" element={<PreLogin />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <TrilhaProvider>
    <PixProvider>
      <PhoneFrame>
        <ToastProvider>
          <AnimatedRoutes />
        </ToastProvider>
      </PhoneFrame>
    </PixProvider>
    </TrilhaProvider>
  );
}
