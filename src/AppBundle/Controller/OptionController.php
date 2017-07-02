<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Option;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;use Symfony\Component\HttpFoundation\Request;

/**
 * Option controller.
 *
 * @Route("option")
 */
class OptionController extends Controller
{
    /**
     * Lists all option entities.
     *
     * @Route("/", name="option_index")
     * @Method("GET")
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $options = $em->getRepository('AppBundle:Option')->findAll();

        return $this->render('option/index.html.twig', array(
            'options' => $options,
        ));
    }

    /**
     * Creates a new option entity.
     *
     * @Route("/new", name="option_new")
     * @Method({"GET", "POST"})
     */
    public function newAction(Request $request)
    {
        $option = new Option();
        $form = $this->createForm('AppBundle\Form\OptionType', $option);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($option);
            $em->flush();

            return $this->redirectToRoute('option_show', array('id' => $option->getId()));
        }

        return $this->render('option/new.html.twig', array(
            'option' => $option,
            'form' => $form->createView(),
        ));
    }

    /**
     * Finds and displays a option entity.
     *
     * @Route("/{id}", name="option_show")
     * @Method("GET")
     */
    public function showAction(Option $option)
    {
        $deleteForm = $this->createDeleteForm($option);

        return $this->render('option/show.html.twig', array(
            'option' => $option,
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Displays a form to edit an existing option entity.
     *
     * @Route("/{id}/edit", name="option_edit")
     * @Method({"GET", "POST"})
     */
    public function editAction(Request $request, Option $option)
    {
        $deleteForm = $this->createDeleteForm($option);
        $editForm = $this->createForm('AppBundle\Form\OptionType', $option);
        $editForm->handleRequest($request);

        if ($editForm->isSubmitted() && $editForm->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('option_edit', array('id' => $option->getId()));
        }

        return $this->render('option/edit.html.twig', array(
            'option' => $option,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Deletes a option entity.
     *
     * @Route("/{id}", name="option_delete")
     * @Method("DELETE")
     */
    public function deleteAction(Request $request, Option $option)
    {
        $form = $this->createDeleteForm($option);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->remove($option);
            $em->flush();
        }

        return $this->redirectToRoute('option_index');
    }

    /**
     * Creates a form to delete a option entity.
     *
     * @param Option $option The option entity
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm(Option $option)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('option_delete', array('id' => $option->getId())))
            ->setMethod('DELETE')
            ->getForm()
        ;
    }

    /**
     * Lists all option entities.
     *
     * @Method("GET")
     */
    public function footerAction()
    {
        $em = $this->getDoctrine()->getManager();

        $bdd_options = $em->getRepository('AppBundle:Option')->findAll();

        foreach ($bdd_options as $option) {
            $options[$option->getLabel()] = $option->getContent();

        }
        /*    switch ($option->getLabel()) {
                case 'facebook':
                    $options['facebook'] = $option->getContent();
                    break;

                case 'twitter':
                    $options['twitter'] = $option->getContent();
                    break;

                case 'googlePlus':
                    $options['googlePlus'] = $option->getContent();
                    break;

                case 'linkedin':
                    $options['linkedin'] = $option->getContent();
                    break;

                case 'dribble':
                    $options['dribble'] = $option->getContent();
                    break;

                case 'copyright':
                    $options['copyright'] = $option->getContent();
                    break;

                case 'location':
                    $options['location'] = $option->getContent();
                    break;

                case 'about':
                    $options['about'] = $option->getContent();
                    break;
                
                default:
                    # code...
                    break;
            }
        }*/
        return $this->render('option/footer.html.twig', array(
            'options' => $options,
        ));
    }

}
