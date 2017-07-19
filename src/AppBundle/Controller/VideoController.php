<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Video;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Video controller.
 *
 * @Route("video")
 */
class VideoController extends Controller
{
    /**
     * Lists all video entities.
     *
     * @Route("/", name="video_index")
     * @Method("GET")
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $videos = $em->getRepository('AppBundle:Video')->findAll();

        return $this->render('video/index.html.twig', array(
            'videos' => $videos,
        ));
    }

    /**
     * Creates a new video entity.
     *
     * @Route("/new", name="video_new")
     * @Method({"GET", "POST"})
     */
    public function newAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();

        $videos = $em->getRepository('AppBundle:Video')->findAll();

        $video = new Video();
        $form = $this->createForm('AppBundle\Form\VideoType', $video);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            dump($video);
            $date = date("Y-m-d");
            dump($date);
            die();
            $em->persist($video);
            $em->flush();

            return $this->redirectToRoute('video_show', array('id' => $video->getId()));
        }

        return $this->render('video/new.html.twig', array(
            'videos' => $videos,
            'video' => $video,
            'form' => $form->createView(),
        ));
    }

    /**
     * Finds and displays a video entity.
     *
     * @Route("/{id}", name="video_show")
     * @Method("GET")
     */
    public function showAction(Video $video)
    {
        $deleteForm = $this->createDeleteForm($video);

        return $this->render('video/show.html.twig', array(
            'video' => $video,
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Displays a form to edit an existing video entity.
     *
     * @Route("/{id}/edit", name="video_edit")
     * @Method({"GET", "POST"})
     */
    public function editAction(Request $request, Video $video)
    {
        $deleteForm = $this->createDeleteForm($video);
        $editForm = $this->createForm('AppBundle\Form\VideoType', $video);
        $editForm->handleRequest($request);

        if ($editForm->isSubmitted() && $editForm->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('video_edit', array('id' => $video->getId()));
        }

        return $this->render('video/edit.html.twig', array(
            'video' => $video,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Deletes a video entity.
     *
     * @Route("/{id}", name="video_delete")
     * @Method("DELETE")
     */
    public function deleteAction(Request $request, Video $video)
    {
        $form = $this->createDeleteForm($video);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->remove($video);
            $em->flush();
        }

        return $this->redirectToRoute('video_index');
    }


    /**
     * @Route("/addVideo", name="add_video", options={"expose"=true})
     */
    public function addVideoAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();

        //infos de l'utlisateur
        $user = $this->get('security.token_storage')->getToken()->getUser();
        $iframe = $request->request->get('iframe');
        $date = new \DateTime( date("Y-m-d H:i:s") );

        if ($request->getMethod() == 'POST') {
            $newVideo = new Video;
            $newVideo->setIframe($iframe);
            $newVideo->setPublicationDate($date);
            $newVideo->setUser($user);
            //dump($newVideo);
            //die();
            $em->persist($newVideo);
            $em->flush();

            $response = ['valid' => false, 'msg' => "Video ajouté"];

            return new JsonResponse($response);

        }


    }

    /**
     * Creates a form to delete a video entity.
     *
     * @param Video $video The video entity
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm(Video $video)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('video_delete', array('id' => $video->getId())))
            ->setMethod('DELETE')
            ->getForm()
        ;
    }
}
