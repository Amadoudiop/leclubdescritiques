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
        $em = $this->getDoctrine()->getManager();

        $pages = $em->getRepository('AppBundle:Page')->findBySection(true);

        // replace this example code with whatever you need
        return $this->render('front/index.html.twig', [
            'base_dir' => realpath($this->getParameter('kernel.root_dir').'/..').DIRECTORY_SEPARATOR,
            'pages' => $pages,
        ]);
    }
    /**
     * @Route("/profil", name="my_profil")
     */
    public function profilAction(Request $request)
    {

        //infos de l'utlisateur
        $user = $this->get('security.token_storage')->getToken()->getUser();

        //les oeuvres de l'utilisateur
        $em = $this->getDoctrine()->getManager();
        $user_oeuvres = $em->getRepository('AppBundle:UserOeuvre')->findByUser($user);
        //var_dump($user_oeuvres[0]->getOeuvre());die;

        $my_profil = true;

        $status = $em->getRepository('AppBundle:Status')->findAll();

        //récupération des salons dans lequel l'user est inscrit
        $salons = $em->getRepository('AppBundle:Salon')->findActualRooms();//var_dump($salons);die;

        $rooms = [];

        foreach ($salons as $salon) {
            if ($salon->hasParticipant($user)) {
                $rooms[] = $salon;
            }
        }

        return $this->render('front/profil.html.twig', [
            'user' => $user,
            'user_oeuvres' => $user_oeuvres,
            'my_profil' => $my_profil,
            'status' => $status,
            'salons' => $rooms
        ]);
    }
    /**
     * @Route("/profil/{id}", name="other_profil")
     */
    public function otherProfilAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $user_target = $this->get('security.token_storage')->getToken()->getUser();

        $user = $em->getRepository('AppBundle:User')->find($id);

        //les oeuvres de l'utilisateur
        $user_oeuvres = $em->getRepository('AppBundle:UserOeuvre')->findByUser($user);
        //var_dump($user_oeuvres[0]->getOeuvre());die;

        $my_profil = false;

        if ($user_target->hasContact($user)) {
            $my_contact = true;
        }else{
            $my_contact = false;
        }

        if ($user->getId() == $user_target->getId()) {
            //var_dump("OK");die;
            return $this->redirectToRoute("my_profil");
        }

        //récupération des salons dans lequel l'user est inscrit
        $salons = $em->getRepository('AppBundle:Salon')->findActualRooms();

        $rooms = [];

        foreach ($salons as $salon) {
            if ($salon->hasParticipant($user)) {
                $rooms[] = $salon;
            }
        }

        return $this->render('front/profil.html.twig', [
            'user' => $user,
            'user_oeuvres' => $user_oeuvres,
            'my_profil' => $my_profil,
            'my_contact' => $my_contact,
            'salons' => $rooms
        ]);
    }
     /**
         * @Route("/salons", name="salons")
         */
        public function salonsAction(Request $request)
        {
            //infos de l'utlisateur
            $user = $this->get('security.token_storage')->getToken()->getUser();

            return $this->render('front/salons.html.twig', [
                'user' => $user
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

}
