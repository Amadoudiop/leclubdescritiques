<?php
// src/AppBundle/Controller/UserController.php

namespace AppBundle\Controller;

use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;

use FOS\UserBundle\Event\FilterUserResponseEvent;
use FOS\UserBundle\Event\FormEvent;
use FOS\UserBundle\Event\GetResponseUserEvent;
use FOS\UserBundle\Form\Factory\FactoryInterface;
use FOS\UserBundle\FOSUserEvents;
use FOS\UserBundle\Model\UserInterface;
use FOS\UserBundle\Model\UserManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\HttpFoundation\JsonResponse;

use AppBundle\Entity\Oeuvre;
use AppBundle\Entity\UserOeuvre;
use AppBundle\Entity\Author;
use AppBundle\Entity\Category;
use AppBundle\Entity\SubCategory;



use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use AppBundle\Entity\User;


use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class UserController extends Controller
{
    /**
     * @Route("/activateAccount/{token}", name="activate_account")
     */
    public function activateAccount($token)
    {
        /** @var $userManager UserManagerInterface */
        $userManager = $this->get('fos_user.user_manager');

        $user = $userManager->findUserByConfirmationToken($token);

        if (null === $user) {
            throw new NotFoundHttpException(sprintf('The user with "confirmation token" does not exist for value "%s"', $token));
        }else{
            return $this->render('front/confirm_account.html.twig');
        }
    }

    /**
     * @Route("/valideActivateAccount", name="valide_activate_account", options={"expose"=true})
     */
    public function valideActivateAccount(Request $request)
    {
        /** @var $userManager UserManagerInterface */
        $userManager = $this->get('fos_user.user_manager');

        $tokenGenerator = $this->get('fos_user.util.token_generator');

        //on récupère le token dans l'url
        $url = $request->headers->get('referer');
        $token = explode("/activateAccount/", $url);

        //$email = $request->request->get('email');
        
        $user = $userManager->findUserByConfirmationToken($token[1]);

        $firstname = $request->request->get('firstname');
        $lastname = $request->request->get('lastname');
        $password = $request->request->get('password');
        $confirmPassword = $request->request->get('confirmPassword');

        if ($request->getMethod() == 'POST') {
            if (!empty($firstname) && !empty($lastname) && !empty($password) && !empty($confirmPassword)) {
                if (strlen($password) >= 8 && strlen($password) <= 12) {
                    if ($password == $confirmPassword) {
                        $user->setFirstname($firstname);
                        $user->setLastname($lastname);
                        $user->setPlainPassword($password);
                        $user->setEnabled(true);
                        $user->setConfirmationToken(null);              

                        $userManager->updateUser($user);

                        $response = ['valid' => true, 'msg' => 'Votre compte est désormais actif']; 
                    }else{
                        $response = ['valid' => false, 'msg' => 'Votre confirmation de mot de passe est incorrect'];
                    } 
                }else{
                    $response = ['valid' => false, 'msg' => 'Le mot de passe doit être compris entre 8 et 12 caractères'];
                }
                     
            }else{
                $response = ['valid' => false, 'msg' => 'Toutes les informations sont obligatoires'];
            }
        }else{
            $response = ['valid' => false, 'msg' => 'Une erreure est survenue, veuillez réessayer'];
        }

        return new JsonResponse($response);
    }

    /**
     * @Route("/editProfil", name="edit_profil", options={"expose"=true})
     */
    public function editProfilAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();

        //infos de l'utlisateur
        $user = $this->get('security.token_storage')->getToken()->getUser();

        $firstname = $request->request->get('firstname');
        $lastname = $request->request->get('lastname');
        $email = $request->request->get('email');
        $description = $request->request->get('description');

        if ($request->getMethod() == 'POST') {
            if (!empty($firstname) && !empty($lastname) && !empty($email) && !empty($description)) {
                $user->setFirstname($firstname);
                $user->setLastname($lastname);
                $user->setEmail($email);
                $user->setDescription($description);

                $em->persist($user);
                $em->flush();

                $response = ['valid' => true, 'msg' => 'Vos informations sont enregistrées'];
                     
            }else{
                $response = ['valid' => false, 'msg' => 'Toutes les informations sont obligatoires'];
            }
        }else{
            $response = ['valid' => false, 'msg' => 'Une erreure est survenue, veuillez réessayer'];
        }

        return new JsonResponse($response);
    }

    /**
     * @Route("/addBook", name="add_book", options={"expose"=true})
     */
    public function addBookAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();

        //infos de l'utlisateur
        $user = $this->get('security.token_storage')->getToken()->getUser();

        $author = $request->request->get('author');
        $title = $request->request->get('title');
        $url_image = $request->request->get('url_image');
        $url_product = $request->request->get('url_product');
        $description = $request->request->get('description');
        $publication_date = $request->request->get('publication_date');
        $publication_date = new \DateTime($publication_date);
        $id_google_api = $request->request->get('id_google_api');
        $sub_category = $request->request->get('sub_category');

        if ($request->getMethod() == 'POST') {
            $book = $em->getRepository('AppBundle:Oeuvre')->findOneBy(['id_google_api' => $id_google_api]);

            $author1 = $em->getRepository('AppBundle:Author')->findOneBy(['firstname' => $author]);

            $category = $em->getRepository('AppBundle:Category')->find(1);

            $sub_category1 = $em->getRepository('AppBundle:SubCategory')->findOneBy(['name' => $sub_category]);

            //si l'oeuvre n'existe pas
            if (null === $book) {
                //si l'auteur n'existe pas
                if (null === $author1) {
                    $newAuthor = new Author();
                    $newAuthor->setFirstname($author);
                    $newAuthor->setLastname('');
                    $newAuthor->setLittleBio('');

                    $em->persist($newAuthor);
                    $em->flush();

                    $author1 = $em->getRepository('AppBundle:Author')->findOneBy(['firstname' => $author]);
                }

                //si la sous catégorie n'existe pas
                if (null === $sub_category1) {
                    $newSubCategory = new SubCategory();
                    $newSubCategory->setName($sub_category);
                    $newSubCategory->setCategory($category);

                    $em->persist($newSubCategory);
                    $em->flush();

                    $sub_category1 = $em->getRepository('AppBundle:SubCategory')->findOneBy(['name' => $sub_category]);
                }

                $newBook = new Oeuvre();
                $newBook->setTitle($title);
                $newBook->setUrlProduct($url_product);
                $newBook->setDescription($description);
                $newBook->setUrlImage($url_image);
                $newBook->setPublicationDate($publication_date);
                $newBook->setRating(5);
                $newBook->setAuthor($author1);
                $newBook->setIdGoogleApi($id_google_api);
                $newBook->setCategory($category);
                $newBook->setSubCategory($sub_category1);
                $newBook->setTrends(false);
                $newBook->setApproved(false);

                $em->persist($newBook);
                $em->flush();

                $book = $em->getRepository('AppBundle:Oeuvre')->findOneBy(['id_google_api' => $id_google_api]);
            }


            $status = $em->getRepository('AppBundle:Status')->find(1);

            $user_oeuvre = $em->getRepository('AppBundle:UserOeuvre')->findOneBy(['user' => $user, 'oeuvre' => $book]);

            if ($user_oeuvre) {
                $response = ['valid' => false, 'msg' => "Ce livre est déjà votre liste"];
            }else{
                $userBook = new UserOeuvre();
                $userBook->setUser($user);
                $userBook->setOeuvre($book);
                $userBook->setStatus($status);
                $userBook->setRating(5);    

                $em->persist($userBook);
                $em->flush();   

                $response = ['valid' => true, 'msg' => 'Ce livre a été ajouté à votre liste'];
            }
                     
        }else{
            $response = ['valid' => false, 'msg' => 'Une erreure est survenue, veuillez réessayer'];
        }

        return new JsonResponse($response);
    }


    /**
     * Lists all user entities.
     *
     * @Route("/admin/users/", name="user_index")
     * @Method("GET")
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $users = $em->getRepository('AppBundle:User')->findAll();

        return $this->render('user/index.html.twig', array(
            'users' => $users,
        ));
    }

    /**
     * Creates a new user entity.
     *
     * @Route("/admin/user/new", name="user_new")
     * @Method({"GET", "POST"})
     */
    public function newAction(Request $request)
    {
        $user = new User();
        $form = $this->createForm('AppBundle\Form\UserType', $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($user);
            $em->flush();

            // Show notice
            $this->addFlash(
                'notice',
                'User Added'
            );

            return $this->redirectToRoute('user_show', array('id' => $user->getId()));
        }

        return $this->render('user/new.html.twig', array(
            'user' => $user,
            'form' => $form->createView(),
        ));
    }


    /**
     * Finds and displays a oeuvre entity.
     *
     * @Route("/user/{id}", name="oeuvre_show")
     * @Method("GET")
     */
    public function showAction(Oeuvre $oeuvre)
    {
        $deleteForm = $this->createDeleteForm($oeuvre);

        return $this->render('oeuvre/show.html.twig', array(
            'oeuvre' => $oeuvre,
            'delete_form' => $deleteForm->createView(),
        ));
    }


    /**
     * Displays a form to edit an existing user entity.
     *
     * @Route("/admin/user/{id}/edit", name="user_edit")
     * @Method({"GET", "POST"})
     */
    public function editAction(Request $request, User $user)
    {
        //dump($user);
        //die();
        $deleteForm = $this->createDeleteForm($user);
        $editForm = $this->createForm('AppBundle\Form\UserType', $user);
        $editForm->handleRequest($request);

        if ($editForm->isSubmitted() && $editForm->isValid()) {
            $this->getDoctrine()->getManager()->flush();


            // Show notice
            $this->addFlash(
                'notice',
                'User Edited'
            );

            return $this->redirectToRoute('user_edit', array('id' => $user->getId()));
        }

        return $this->render('user/edit.html.twig', array(
            'user' => $user,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Deletes a user entity.
     *
     * @Route("/admin/user/{id}", name="user_delete")
     * @Method("DELETE")
     */
    public function deleteAction(Request $request, User $user)
    {
        $form = $this->createDeleteForm($user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->remove($user);
            $em->flush();

            // Show notice
            $this->addFlash(
                'notice',
                'User Added'
            );
        }

        return $this->redirectToRoute('user_index');
    }

    /**
     * Creates a form to delete a user entity.
     *
     * @param User $user The user entity
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm(User $user)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('user_delete', array('id' => $user->getId())))
            ->setMethod('DELETE')
            ->getForm()
        ;
    }

    /**
     * @Route("/getInfosUser/{id}", name="get_infos_user", options={"expose"=true})
     */
    public function getInfosUserAction($id)
    {
        $em = $this->getDoctrine()->getManager();
        
        $user = $em->getRepository('AppBundle:User')->find($id);

        if (null === $user) {
          throw new NotFoundHttpException("L'utilisateur d'id ".$id." n'existe pas.");
        }

        $data = [];

        $firstname = (empty($user->getFirstname())) ? '' : $user->getFirstname();
        $lastname = (empty($user->getLastname())) ? '' : $user->getLastname();
        $description = (empty($user->getDescription())) ? '' : $user->getDescription();
        $last_login = (empty($user->getLastLogin()->format('d/m/Y'))) ? '' : $user->getLastLogin()->format('d/m/Y');
        $email = (empty($user->getEmail())) ? '' : $user->getEmail();

        $data = [
            'firstname' => $firstname,
            'lastname' => $lastname,
            'description' => $description,
            'last_login' => $last_login,
            'email' => $email,
         ];

        return new JsonResponse($data);
    }

    /**
     * @Route("/getBooksUser/{id}", name="get_bookss_user", options={"expose"=true})
     */
    public function getBooksUserAction($id)
    {
        $em = $this->getDoctrine()->getManager();
        
        $user = $em->getRepository('AppBundle:User')->find($id);

        if (null === $user) {
          throw new NotFoundHttpException("L'utilisateur d'id ".$id." n'existe pas.");
        }

        //les oeuvres de l'utilisateur
        $em = $this->getDoctrine()->getManager();
        $user_oeuvres = $em->getRepository('AppBundle:UserOeuvre')->findByUser($user);

        $data = [];

        foreach ($user_oeuvres as $user_oeuvre) {
            $title = (empty($user_oeuvre->getOeuvre()->getTitle())) ? '' : $user_oeuvre->getOeuvre()->getTitle();
            $url_product = (empty($user_oeuvre->getOeuvre()->getUrlProduct())) ? '' : $user_oeuvre->getOeuvre()->getUrlProduct();
            $description = (empty($user_oeuvre->getOeuvre()->getDescription())) ? '' : $user_oeuvre->getOeuvre()->getDescription();
            $url_image = (empty($user_oeuvre->getOeuvre()->getUrlImage())) ? '' : $user_oeuvre->getOeuvre()->getUrlImage();
            $publication_date = (empty($user_oeuvre->getOeuvre()->getPublicationDate()->format('d/m/Y'))) ? '' : $user_oeuvre->getOeuvre()->getPublicationDate()->format('d/m/Y');
            $rating = (empty($user_oeuvre->getOeuvre()->getRating())) ? '' : $user_oeuvre->getOeuvre()->getRating();
            $author = (empty($user_oeuvre->getOeuvre()->getAuthor()->getFirstname())) ? '' : $user_oeuvre->getOeuvre()->getAuthor()->getFirstname();
            $category = (empty($user_oeuvre->getOeuvre()->getCategory()->getName())) ? '' : $user_oeuvre->getOeuvre()->getCategory()->getName();
            $sub_category = (empty($user_oeuvre->getOeuvre()->getSubCategory()->getName())) ? '' : $user_oeuvre->getOeuvre()->getSubCategory()->getName();

            $data[] = [
                'title' => $title,
                'url_product' => $url_product,
                'description' => $description,
                'url_image' => $url_image,
                'publication_date' => $publication_date,
                'rating' => $rating,
                'author' => $author,
                'category' => $category,
                'sub_category' => $sub_category
             ];
        }

        return new JsonResponse($data);
    }

    /**
     * @Route("/getContactsUser/{id}", name="get_contacts_user", options={"expose"=true})
     */
    public function getContactsUserAction($id)
    {
        $em = $this->getDoctrine()->getManager();
        
        $user = $em->getRepository('AppBundle:User')->find($id);

        if (null === $user) {
          throw new NotFoundHttpException("L'utilisateur d'id ".$id." n'existe pas.");
        }

        $contacts = $user->getContacts();
        $data = [];

        foreach ($contacts as $contact) {   
            $firstname = (empty($contact->getFirstname())) ? '' : $contact->getFirstname();
            $lastname = (empty($contact->getLastname())) ? '' : $contact->getLastname();   

            $data[] = [
                'firstname' => $firstname,
                'lastname' => $lastname,
             ];
        }

        return new JsonResponse($data);
    }

    /**
     * @Route("/addContact", name="add_contact", options={"expose"=true})
     * @Method({"GET", "POST"})
     */
    public function addContactAction(Request $request)
    {
        //dump($request);die;
        $em = $this->getDoctrine()->getManager();

        //infos de l'utlisateur
        $user = $this->get('security.token_storage')->getToken()->getUser();

        $id_user= $request->request->get('id_user');
        //var_dump($id_user);die;

        $user_target = $em->getRepository('AppBundle:User')->find($id_user);

        if ($request->getMethod() == 'POST') {
            if (null === $user_target) {

                $response = ['valid' => false, 'msg' => "Cet utilisateur n'existe pas"];
            }else{
                if ($user->hasContact($user_target)) {
                    $response = ['valid' => true, 'msg' => 'Cet utilisateur est déjà dans vos contacts']; 
                }else{
                    $user->addContact($user_target);
                    $em->flush();   

                    $response = ['valid' => true, 'msg' => 'Ce contact est enregistré']; 
                }
            }
        }else{
            $response = ['valid' => false, 'msg' => 'Une erreure est survenue, veuillez réessayer'];
        }

        return new JsonResponse($response);
    }

    /**
     * @Route("/removeContact", name="remove_contact", options={"expose"=true})
     * @Method({"GET", "POST"})
     */
    public function removeContactAction(Request $request)
    {
        //dump($request);die;
        $em = $this->getDoctrine()->getManager();

        //infos de l'utlisateur
        $user = $this->get('security.token_storage')->getToken()->getUser();

        $id_user= $request->request->get('id_user');
        //var_dump($id_user);die;

        $user_target = $em->getRepository('AppBundle:User')->find($id_user);

        if ($request->getMethod() == 'POST') {
            if (null === $user_target) {

                $response = ['valid' => false, 'msg' => "Cet utilisateur n'existe pas"];
            }else{
                if (!$user->hasContact($user_target)) {
                    $response = ['valid' => true, 'msg' => "Cet utilisateur n'est pas dans vos contacts"]; 
                }else{
                    $user->removeContact($user_target);
                    $em->flush();   

                    $response = ['valid' => true, 'msg' => 'Ce contact est supprimé']; 
                }
            }
        }else{
            $response = ['valid' => false, 'msg' => 'Une erreure est survenue, veuillez réessayer'];
        }

        return new JsonResponse($response);
    }

    /**
     * @Route("/sendMessagePersonal", name="send_message", options={"expose"=true})
     * @Method({"GET", "POST"})
     */
    public function sendMessagePersonalAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();

        //infos de l'utlisateur
        $user = $this->get('security.token_storage')->getToken()->getUser();

        $id_user = $request->request->get('id_user');
        $sujet = $request->request->get('sujet');
        $message = $request->request->get('message');

        $user_target = $em->getRepository('AppBundle:User')->find($id_user);

        if ($request->getMethod() == 'POST') {
            if (!empty($sujet) && !empty($message)) {

                $message = (new \Swift_Message('Un utilisateur vous envoie un email'))
                ->setFrom($this->getParameter('mailer_user'))
                ->setTo($user_target->getEmail())
                ->setBody(
                    $this->renderView(
                        'email/send_message.html.twig',
                        ['user' => $user, 'user_target' => $user_target, 'sujet' => $sujet, 'message' => $message]
                    ),
                    'text/html'
                );      

                $this->get('mailer')->send($message);

                $response = ['valid' => true, 'msg' => 'Votre message a été envoyé']; 
            }else{
                $response = ['valid' => false, 'msg' => 'Toute les informations sont obligatoires'];
            }
        }else{
            $response = ['valid' => false, 'msg' => 'Une erreure est survenue, veuillez réessayer'];
        }

        return new JsonResponse($response);
    }
}