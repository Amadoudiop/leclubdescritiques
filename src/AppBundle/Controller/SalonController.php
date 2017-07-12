<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Salon;
use AppBundle\Entity\SalonMessages;
use AppBundle\Entity\User;
use AppBundle\Entity\Oeuvre;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Salon controller.
 *
 */
class SalonController extends Controller
{
    /**
     * Lists all salon entities.
     *
     * @Route("/admin/salons/", name="salon_index")
     * @Method("GET")
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $salons = $em->getRepository('AppBundle:Salon')->findAll();

        return $this->render('salon/index.html.twig', array(
            'salons' => $salons,
        ));
    }

    /**
     * Creates a new salon entity.
     *
     * @Route("/admin/salon/new", name="salon_new")
     * @Method({"GET", "POST"})
     */
    public function newAction(Request $request)
    {
        $salon = new Salon();
        $form = $this->createForm('AppBundle\Form\SalonType', $salon);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($salon);
            $em->flush();

            // Show notice
            $this->addFlash(
                'notice',
                'Salon Added'
            );

            return $this->redirectToRoute('salon_show', array('id' => $salon->getId()));
        }

        return $this->render('salon/new.html.twig', array(
            'salon' => $salon,
            'form' => $form->createView(),
        ));
    }

    /**
     * Finds and displays a salon entity.
     *
     * @Route("/admin/salon/{id}", name="salon_show")
     * @Method("GET")
     */
    public function showAction(Salon $salon)
    {
        $deleteForm = $this->createDeleteForm($salon);

        return $this->render('salon/show.html.twig', array(
            'salon' => $salon,
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Displays a form to edit an existing salon entity.
     *
     * @Route("/admin/salon/{id}/edit", name="salon_edit")
     * @Method({"GET", "POST"})
     */
    public function editAction(Request $request, Salon $salon)
    {
        $deleteForm = $this->createDeleteForm($salon);
        $editForm = $this->createForm('AppBundle\Form\SalonType', $salon);
        $editForm->handleRequest($request);

        if ($editForm->isSubmitted() && $editForm->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            // Show notice
            $this->addFlash(
                'notice',
                'Salon Edited'
            );

            return $this->redirectToRoute('salon_edit', array('id' => $salon->getId()));
        }

        return $this->render('salon/edit.html.twig', array(
            'salon' => $salon,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Deletes a salon entity.
     *
     * @Route("/admin/salon/{id}", name="salon_delete")
     * @Method("DELETE")
     */
    public function deleteAction(Request $request, Salon $salon)
    {
        $form = $this->createDeleteForm($salon);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->remove($salon);
            $em->flush();

            // Show notice
            $this->addFlash(
                'notice',
                'Salon Deleted'
            );
        }

        return $this->redirectToRoute('salon_index');
    }

    /**
     * Creates a form to delete a salon entity.
     *
     * @param Salon $salon The salon entity
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm(Salon $salon)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('salon_delete', array('id' => $salon->getId())))
            ->setMethod('DELETE')
            ->getForm()
        ;
    }

    /**
     * @Route("/salon/{id}", name="salon", options={"expose"=true})
     */
    public function salonAction($id)
    {
        $em = $this->getDoctrine()->getManager();
        $salon = $em->getRepository('AppBundle:Salon')->find($id);

         //infos de l'utlisateur
        $user = $this->get('security.token_storage')->getToken()->getUser();

        $participants = $salon->getParticipants();

        /*foreach ($salon->getParticipants() as $participant) {
            $verif = 
        }*/

        //die;


        $messages = $em->getRepository('AppBundle:SalonMessages')->findBySalon($salon);


        return $this->render('front/chat.html.twig', [
            'salon' => $salon,
            'messages' => $messages,
            'participants' => $participants,
            'user' => $user
        ]);
    }

    /**
     * @Route("/sendMessage", name="send_message", options={"expose"=true})
     * @Method({"GET", "POST"})
     */
    public function sendMessageAction(Request $request)
    {
        //dump($request);die;
        $em = $this->getDoctrine()->getManager();
        //dump($em);die;

        //infos de l'utlisateur
        $user = $this->get('security.token_storage')->getToken()->getUser();
        //var_dump($request);die;

        //on récupère le salon dans l'url
        //$url = $request->headers->get('referer');
        //$url = explode("/salon/", $url);

        $id_salon = intval($request->request->get('id_salon'));

        $salon = $em->getRepository('AppBundle:Salon')->find($id_salon);
        //dump($salon);die;

        $message = $request->request->get('message');

        $time = new \DateTime('now');
        //var_dump($time);die;

        if ($request->getMethod() == 'POST') {
            if (!empty($message)) {
                $salon_message = new SalonMessages();
                $salon_message->setSalon($salon);
                $salon_message->setUser($user);
                $salon_message->setMessage($message);
                $salon_message->setTime($time);

                $em->persist($salon_message);
                $em->flush();

                $response = ['valid' => true, 'msg' => 'Message envoyé']; 
            }else{
                $response = ['valid' => false, 'msg' => 'Votre message est obligatoire'];
            }
        }else{
            $response = ['valid' => false, 'msg' => 'Une erreure est survenue, veuillez réessayer'];
        }

        return new JsonResponse($response);
    }

    /**
     * @Route("/getRooms", name="get_rooms", options={"expose"=true})
     */
    public function getRoomsAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        
        $salons = $em->getRepository('AppBundle:Salon')->findAll();

        $data = [];
        
        foreach ($salons as $salon) {
            $title = (empty($salon->getTitle())) ? '' : $salon->getTitle();
            $participants_number = (empty($salon->getParticipantsNumber())) ? '' : $salon->getParticipantsNumber();
            $oeuvre = (empty($salon->getOeuvre()->getTitle())) ? '' : $salon->getOeuvre()->getTitle();
            $created_by = (empty($salon->getUser()->getFirstname())) ? '' : $salon->getUser()->getFirstname().' '.$salon->getUser()->getLastname();
            //$participants = (empty($salon->getParticipants())) ? '' : $salon->getParticipants();
            $start_date = (empty($salon->getDateStart()->format('d/m/Y'))) ? '' : $salon->getDateStart()->format('d/m/Y');
            $end_date = (empty($salon->getDateEnd()->format('d/m/Y'))) ? '' : $salon->getDateEnd()->format('d/m/Y');
            $id = (empty($salon->getId())) ? '' : $salon->getId();

            $data[] = [
                'title' => $title,
                'participants_number' => $participants_number,
                'oeuvre' => $oeuvre,
                'created_by' => $created_by,
                /*'participants' => $participants,*/
                'start_date' => $start_date,
                'end_date' => $end_date,
                'id' => $id
             ];
        }

        return new JsonResponse($data);
    }

    /**
     * @Route("/createRoom", name="create_room", options={"expose"=true})
     * @Method({"GET", "POST"})
     */
    public function createRoomAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();

        //infos de l'utlisateur
        $user = $this->get('security.token_storage')->getToken()->getUser();

        $title = $request->request->get('title');
        $oeuvre = $request->request->get('book');
        $nb_max_part = intval($request->request->get('nb_max_part'));
        $date_start = $request->request->get('date_start');
        $date_end = $request->request->get('date_end');

        if ($request->getMethod() == 'POST') {
            if (!empty($title) && !empty($oeuvre) && !empty($nb_max_part) &&!empty($date_start) && !empty($date_end)) {

                $book = $em->getRepository('AppBundle:Oeuvre')->find($oeuvre);

                if (null === $book) {
                    $response = ['valid' => false, 'msg' => "Cet oeuvre n'existe pas"];
                }else{
                    $user_oeuvre = $em->getRepository('AppBundle:UserOeuvre')->findOneBy(['user' => $user, 'oeuvre' => $book]);

                    if (null === $user_oeuvre) {
                        $response = ['valid' => false, 'msg' => "Cet oeuvre n'est pas dans votre liste"];
                    }else{
                        $date_start = new \DateTime($date_start);
                        $date_end = new \DateTime($date_end);

                        $salon = new Salon();
                        $salon->setTitle($title);
                        $salon->setParticipantsNumber($nb_max_part);
                        $salon->setDateStart($date_start);
                        $salon->setDateEnd($date_end);     
                        $salon->setOeuvre($book);     
                        $salon->setUser($user);     
                        $salon->addParticipant($user);    

                        $em->persist($salon);
                        $em->flush();

                        $response = ['valid' => true, 'msg' => 'Salon créé']; 
                    }
                }  
            }else{
                $response = ['valid' => false, 'msg' => 'Toute les informations sont obligatoires'];
            }
        }else{
            $response = ['valid' => false, 'msg' => 'Une erreure est survenue, veuillez réessayer'];
        }

        return new JsonResponse($response);
    }

    /**
     * @Route("/rejoinRoom", name="create_room", options={"expose"=true})
     * @Method({"GET", "POST"})
     */
    public function rejoinRoomAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();

        //infos de l'utlisateur
        $user = $this->get('security.token_storage')->getToken()->getUser();

        $id_salon = $request->request->get('id_salon');

        if ($request->getMethod() == 'POST') {

            $salon = $em->getRepository('AppBundle:Salon')->find($id_salon);

            if (null === $salon) {
                $response = ['valid' => false, 'msg' => "Ce salon n'existe pas"];
            }else{
                $user_oeuvre = $em->getRepository('AppBundle:UserOeuvre')->findOneBy(['user' => $user, 'oeuvre' => $salon->getOeuvre()]);

                if (null === $user_oeuvre) {
                    $response = ['valid' => false, 'msg' => "Cet oeuvre n'est pas dans votre liste"];
                }else{
                    if ($salon->hasParticipant($user)) {
                        $response = ['valid' => true, 'msg' => 'Salon rejoint 1']; 
                    }else{
                        $participants = $salon->getParticipants();
                        $nb_part = count($participants);
                        $nb_part_max = $salon->getParticipantsNumber();

                        if ($nb_part >= $nb_part_max) {
                            $response = ['valid' => false, 'msg' => "Le nombre maximum de participants est atteint"];
                        }else{
                            $salon->addParticipant($user);  
                            $em->flush();       

                            $response = ['valid' => true, 'msg' => 'Salon rejoint 2']; 
                        }
                    }
                }

            }  
        }else{
            $response = ['valid' => false, 'msg' => 'Une erreure est survenue, veuillez réessayer'];
        }

        return new JsonResponse($response);
    }

}
