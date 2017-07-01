<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function indexAction(Request $request)
    {
        //$user = $this->get('security.token_storage')->getToken()->getUser();
        //var_dump($user);die;
        // replace this example code with whatever you need
        return $this->render('front/index.html.twig', [
            'base_dir' => realpath($this->getParameter('kernel.root_dir').'/..').DIRECTORY_SEPARATOR,
        ]);
    }
    /**
     * @Route("/profil", name="profil")
     */
    public function profilAction(Request $request)
    {
        //infos de l'utlisateur
        $user = $this->get('security.token_storage')->getToken()->getUser();

        //les oeuvres de l'utilisateur
        $em = $this->getDoctrine()->getManager();
        $user_oeuvres = $em->getRepository('AppBundle:UserOeuvre')->findByUser($user);
        //var_dump($user_oeuvres[0]->getOeuvre());die;

        return $this->render('front/profil.html.twig', [
            'user' => $user,
            'user_oeuvres' => $user_oeuvres
        ]);
    }
     /**
         * @Route("/salons", name="salons")
         */
        public function salonsAction(Request $request)
        {

            return $this->render('front/salons.html.twig', [
                'base_dir' => realpath($this->getParameter('kernel.root_dir').'/..').DIRECTORY_SEPARATOR,
            ]);
        }
    /**
         * @Route("/livres", name="livres")
         */
        public function livreAction(Request $request)
        {

            return $this->render('front/livres.html.twig', [
                'base_dir' => realpath($this->getParameter('kernel.root_dir').'/..').DIRECTORY_SEPARATOR,
            ]);
        }

    /**
     * @Route("/chat", name="chat")
     */
    public function chatAction(Request $request)
    {
        return $this->render('chat/chat.html.twig', [
            'base_dir' => realpath($this->getParameter('kernel.root_dir').'/..').DIRECTORY_SEPARATOR,
        ]);
    }

}
