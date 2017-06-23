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
     * @Route("/salon/{id}", name="salon")
     */
    public function salonAction($id)
    {
        $em = $this->getDoctrine()->getManager();
        $salon = $em->getRepository('AppBundle:Salon')->findById($id);

        $messages = $em->getRepository('AppBundle:SalonMessages')->findBySalon($salon);

        //var_dump($salon);die;

        return $this->render('front/chat.html.twig', [
            'salon' => $salon,
            'messages' => $messages
        ]);
    }
}
