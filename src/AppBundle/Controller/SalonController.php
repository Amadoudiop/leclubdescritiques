<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Salon;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;use Symfony\Component\HttpFoundation\Request;

/**
 * Salon controller.
 *
 */
class SalonController extends Controller
{
    /**
     * Lists all salon entities.
     *
     * @Route("/admin/salon/", name="salon_index")
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
}
